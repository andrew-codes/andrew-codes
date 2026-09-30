import { ToolError, runTool, toolDefinitions, type DataSource } from "./agent-tools"

// WebMCP: registers the same read-only tools as the Worker's /mcp endpoint
// with the browser, so an agent in a browser that supports it can call them
// while a visitor has the site open. WebMCP is an unsettled W3C draft (the API
// was renamed and trimmed during 2026), so everything here is feature-detected
// and defensive: where the API is missing or rejects a call, this does nothing.

type WebMcpToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean }

type WebMcpTool = {
  name: string
  title: string
  description: string
  inputSchema: object
  annotations: { readOnlyHint: true }
  execute: (input: unknown) => Promise<WebMcpToolResult>
}

type ModelContext = {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => unknown
}

// `document.modelContext` is the current name; `navigator.modelContext` is the
// earlier one, still present in some builds.
const getModelContext = (): ModelContext | undefined => {
  if (typeof document === "undefined" || typeof navigator === "undefined") return undefined

  const candidates = [(document as { modelContext?: unknown }).modelContext, (navigator as { modelContext?: unknown }).modelContext]
  return candidates.find((candidate): candidate is ModelContext => typeof (candidate as ModelContext | undefined)?.registerTool === "function")
}

const createBrowserSource = (fetchImpl: typeof fetch): DataSource => {
  const read = async (path: string): Promise<Response> => {
    const response = await fetchImpl(path)
    if (!response.ok) throw new Error(`${path} returned ${response.status}`)
    return response
  }

  return {
    json: async (path) => (await read(path)).json(),
    text: async (path) => (await read(path)).text(),
  }
}

// Registers every tool and returns a function that unregisters them. Returns
// undefined when the browser has no WebMCP. A tool the browser refuses is
// skipped; the rest still register.
const registerWebMcpTools = (modelContext: ModelContext | undefined = getModelContext(), source: DataSource = createBrowserSource((input) => fetch(input))): (() => void) | undefined => {
  if (!modelContext) return undefined

  const controller = new AbortController()

  for (const tool of toolDefinitions) {
    try {
      modelContext.registerTool(
        {
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: true },
          execute: async (input) => {
            try {
              return { content: [{ type: "text", text: await runTool(tool.name, source, input) }] }
            } catch (error) {
              const message = error instanceof ToolError ? error.message : "The site data could not be read. Try again."
              return { content: [{ type: "text", text: message }], isError: true }
            }
          },
        },
        { signal: controller.signal },
      )
    } catch {
      // Already registered (e.g. a hot reload) or rejected by this browser.
    }
  }

  return () => controller.abort()
}

export { createBrowserSource, getModelContext, registerWebMcpTools }
export type { ModelContext, WebMcpTool }
