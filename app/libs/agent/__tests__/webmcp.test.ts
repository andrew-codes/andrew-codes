import { afterEach, describe, expect, it, vi } from "vitest"
import { toolDefinitions } from "../agent-tools"
import { createBrowserSource, getModelContext, registerWebMcpTools, type WebMcpTool } from "../webmcp"
import { createGraphSource, fixtureGraph } from "./agent-tools-source"

const createModelContext = (options: { failOn?: string[] } = {}) => {
  const tools: WebMcpTool[] = []
  const signals: Array<AbortSignal | undefined> = []

  return {
    tools,
    signals,
    modelContext: {
      registerTool: (tool: WebMcpTool, registerOptions?: { signal?: AbortSignal }) => {
        if (options.failOn?.includes(tool.name)) throw new Error("rejected")
        tools.push(tool)
        signals.push(registerOptions?.signal)
      },
    },
  }
}

const source = createGraphSource(fixtureGraph())

afterEach(() => vi.unstubAllGlobals())

describe("getModelContext", () => {
  it("finds nothing outside a browser or without the API", () => {
    expect(getModelContext()).toBeUndefined()

    vi.stubGlobal("document", {})
    vi.stubGlobal("navigator", {})
    expect(getModelContext()).toBeUndefined()
  })

  it("prefers document.modelContext", () => {
    const current = createModelContext().modelContext
    const legacy = createModelContext().modelContext
    vi.stubGlobal("document", { modelContext: current })
    vi.stubGlobal("navigator", { modelContext: legacy })

    expect(getModelContext()).toBe(current)
  })

  it("falls back to the deprecated navigator.modelContext", () => {
    const legacy = createModelContext().modelContext
    vi.stubGlobal("document", {})
    vi.stubGlobal("navigator", { modelContext: legacy })

    expect(getModelContext()).toBe(legacy)
  })

  it("ignores a modelContext without registerTool", () => {
    vi.stubGlobal("document", { modelContext: { provideContext: () => undefined } })
    vi.stubGlobal("navigator", {})

    expect(getModelContext()).toBeUndefined()
  })
})

describe("registerWebMcpTools", () => {
  it("does nothing where WebMCP is unsupported", () => {
    expect(registerWebMcpTools(undefined, source)).toBeUndefined()
  })

  it("registers the six tools as read-only with their input schemas", () => {
    const { modelContext, tools } = createModelContext()
    registerWebMcpTools(modelContext, source)

    expect(tools.map((tool) => tool.name)).toEqual(toolDefinitions.map((tool) => tool.name))
    for (const tool of tools) {
      expect(tool.annotations).toEqual({ readOnlyHint: true })
      expect(tool.inputSchema).toBe(toolDefinitions.find((definition) => definition.name === tool.name)?.inputSchema)
    }
  })

  it("unregisters every tool through the abort signal", () => {
    const { modelContext, signals } = createModelContext()
    const unregister = registerWebMcpTools(modelContext, source)

    expect(signals.every((signal) => signal && !signal.aborted)).toBe(true)
    unregister?.()
    expect(signals.every((signal) => signal?.aborted)).toBe(true)
  })

  it("keeps registering when the browser rejects one tool", () => {
    const { modelContext, tools } = createModelContext({ failOn: ["get_post"] })

    expect(() => registerWebMcpTools(modelContext, source)).not.toThrow()
    expect(tools.map((tool) => tool.name)).toEqual(["get_profile", "search_posts", "get_resume", "list_recommendations", "list_projects"])
  })

  it("runs a tool and returns its text as content", async () => {
    const { modelContext, tools } = createModelContext()
    registerWebMcpTools(modelContext, source)
    const search = tools.find((tool) => tool.name === "search_posts")

    const result = await search?.execute({ query: "graphql" })

    expect(result?.isError).toBeUndefined()
    expect(JSON.parse(result?.content[0].text ?? "").posts.map((post: { slug: string }) => post.slug)).toEqual(["graphql-schema"])
  })

  it("reports bad arguments as an error result instead of throwing", async () => {
    const { modelContext, tools } = createModelContext()
    registerWebMcpTools(modelContext, source)

    expect(await tools.find((tool) => tool.name === "get_post")?.execute({ slug: "nope" })).toEqual({ content: [{ type: "text", text: expect.stringContaining('No post with slug "nope"') }], isError: true })
  })

  it("hides unexpected failures behind a generic message", async () => {
    const { modelContext, tools } = createModelContext()
    registerWebMcpTools(modelContext, { json: async () => Promise.reject(new Error("/agent/posts.json returned 500")), text: async () => "" })

    const result = await tools.find((tool) => tool.name === "search_posts")?.execute({})

    expect(result).toEqual({ content: [{ type: "text", text: "The site data could not be read. Try again." }], isError: true })
  })
})

describe("createBrowserSource", () => {
  it("fetches same-origin paths and parses them", async () => {
    const fetchImpl = vi.fn(async (path: RequestInfo | URL) => new Response(String(path).endsWith(".json") ? '{"ok":true}' : "# Title"))
    const browserSource = createBrowserSource(fetchImpl as unknown as typeof fetch)

    expect(await browserSource.json("/agent/posts.json")).toEqual({ ok: true })
    expect(await browserSource.text("/posts/a.md")).toBe("# Title")
    expect(fetchImpl).toHaveBeenCalledWith("/agent/posts.json")
  })

  it("throws on a failed response", async () => {
    const browserSource = createBrowserSource((async () => new Response("no", { status: 404 })) as unknown as typeof fetch)

    await expect(browserSource.json("/agent/posts.json")).rejects.toThrow("returned 404")
  })
})
