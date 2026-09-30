import { describe, expect, it } from "vitest"
import { createGraphSource, fixtureGraph } from "../../../app/libs/agent/__tests__/agent-tools-source"
import { scan } from "../../../app/libs/agent/__tests__/privacy-scan"
import worker from "../index"

// Drives the real /mcp handler (createMcpHandler) with JSON-RPC over HTTP,
// backed by a fake static assets binding that serves the documents the build
// emits. This is the closest check to the deployed endpoint without running
// wrangler.

const graphSource = createGraphSource(fixtureGraph())

const assets = {
  fetch: async (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url)
    try {
      return pathname.endsWith(".md") ? new Response(await graphSource.text(pathname)) : new Response(JSON.stringify(await graphSource.json(pathname)))
    } catch {
      return new Response("Not found", { status: 404 })
    }
  },
}

const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined } as unknown as Parameters<typeof worker.fetch>[2]

const rpc = async (method: string, params: unknown = {}, id = 1) => {
  const response = await worker.fetch(
    new Request("https://andrew.codes/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    }),
    { ASSETS: assets },
    ctx,
  )
  const body = await response.text()
  // A response may come back as JSON or as a single server-sent event.
  const payload = body.startsWith("event:") || body.includes("\ndata:") || body.startsWith("data:") ? body.split("\n").find((line) => line.startsWith("data:"))?.slice(5) : body
  return { status: response.status, message: JSON.parse(payload ?? "null") }
}

const initialize = () => rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1.0.0" } })

describe("/mcp", () => {
  it("initializes and advertises tools and resources", async () => {
    const { status, message } = await initialize()

    expect(status).toBe(200)
    expect(message.result.serverInfo.name).toBe("andrew-codes")
    expect(message.result.capabilities).toHaveProperty("tools")
    expect(message.result.capabilities).toHaveProperty("resources")
  })

  it("lists the six tools, all marked read-only", async () => {
    const { message } = await rpc("tools/list")

    expect(message.result.tools.map((tool: { name: string }) => tool.name)).toEqual(["get_profile", "search_posts", "get_post", "get_resume", "list_recommendations", "list_projects"])
    for (const tool of message.result.tools) {
      expect(tool.annotations.readOnlyHint).toBe(true)
      expect(tool.inputSchema.type).toBe("object")
    }
    expect(message.result.tools.find((tool: { name: string }) => tool.name === "get_post").inputSchema.required).toEqual(["slug"])
  })

  it("calls a tool over the assets binding", async () => {
    const { message } = await rpc("tools/call", { name: "search_posts", arguments: { query: "graphql" } })
    const result = JSON.parse(message.result.content[0].text)

    expect(message.result.isError).toBeFalsy()
    expect(result.posts.map((post: { slug: string }) => post.slug)).toEqual(["graphql-schema"])
  })

  it("returns a post as markdown", async () => {
    const { message } = await rpc("tools/call", { name: "get_post", arguments: { slug: "react-testing" } })

    expect(message.result.content[0].text).toMatch(/^# Testing React components/)
  })

  it("reports an unknown post as a tool error", async () => {
    const { message } = await rpc("tools/call", { name: "get_post", arguments: { slug: "nope" } })

    expect(message.result.isError).toBe(true)
    expect(message.result.content[0].text).toContain('No post with slug "nope"')
  })

  it("rejects input that breaks the schema", async () => {
    const { message } = await rpc("tools/call", { name: "get_resume", arguments: { section: "salary" } })

    expect(message.result.isError).toBe(true)
    expect(message.result.content[0].text).toContain("Invalid arguments for tool get_resume")
  })

  it("lists and reads resources", async () => {
    const { message: listed } = await rpc("resources/list")
    const uris = listed.result.resources.map((resource: { uri: string }) => resource.uri)

    expect(uris).toEqual(expect.arrayContaining(["site://profile", "site://resume", "site://recommendations", "site://projects", "site://posts", "site://posts/react-testing"]))

    const { message: profile } = await rpc("resources/read", { uri: "site://profile" })
    expect(JSON.parse(profile.result.contents[0].text).name).toBe("James Andrew Smith")

    const { message: post } = await rpc("resources/read", { uri: "site://posts/graphql-schema" })
    expect(post.result.contents[0].text).toMatch(/^# GraphQL schema design/)
  })

  it("keeps contact details out of everything the endpoint returns", async () => {
    const calls = [
      rpc("tools/call", { name: "get_profile", arguments: {} }),
      rpc("tools/call", { name: "get_resume", arguments: {} }),
      rpc("tools/call", { name: "list_recommendations", arguments: {} }),
      rpc("tools/call", { name: "list_projects", arguments: {} }),
      rpc("resources/list"),
      rpc("resources/read", { uri: "site://resume" }),
      rpc("tools/list"),
    ]

    for (const { message } of await Promise.all(calls)) scan("mcp", JSON.stringify(message).replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE"))
  })

  it("exposes no write tools", async () => {
    const { message } = await rpc("tools/list")

    for (const tool of message.result.tools) expect(tool.name).toMatch(/^(get|list|search)_/)
  })

  it("leaves other paths alone", async () => {
    const response = await worker.fetch(new Request("https://andrew.codes/healthcheck"), { ASSETS: assets }, ctx)

    expect(await response.text()).toBe("OK")
  })
})
