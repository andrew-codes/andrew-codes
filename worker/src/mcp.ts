import { McpServer, ResourceTemplate, type CallToolResult } from "@modelcontextprotocol/server"
import { createMcpHandler, type StatelessMcpHandler } from "agents/mcp/server"
import { z } from "zod"
import { POST_RESOURCE_TEMPLATE, ToolError, getPosts, resourceDefinitions, runTool, toolDefinitions, type DataSource, type JsonSchema, type ToolDefinition } from "../../app/libs/agent/agent-tools"

// Read-only MCP endpoint at /mcp: the six tools and five resources from
// app/libs/agent/agent-tools.ts, served statelessly (one server per request)
// over the static documents this site already publishes. No authentication and
// no write tools: everything it can return is already public at its own URL.

type AssetsBinding = { fetch(request: Request): Promise<Response> }
type McpEnv = { ASSETS: AssetsBinding }
type ExecutionContext = Parameters<StatelessMcpHandler>[2]

const ROUTE = "/mcp"

// Reads the site's own built files through the static assets binding, so the
// endpoint and the website can never disagree.
const createAssetSource = (assets: AssetsBinding, origin: string): DataSource => {
  const read = async (path: string): Promise<Response> => {
    const response = await assets.fetch(new Request(new URL(path, origin)))
    if (!response.ok) throw new Error(`${path} returned ${response.status}`)
    return response
  }

  return {
    json: async (path) => (await read(path)).json(),
    text: async (path) => (await read(path)).text(),
  }
}

// zod shape for a tool's JSON schema, so each input is described once.
const toZodShape = (schema: JsonSchema) =>
  Object.fromEntries(
    Object.entries(schema.properties).map(([key, property]) => {
      let field: z.ZodType = z.string()
      if (property.enum) field = z.enum(property.enum as [string, ...string[]])
      else if (property.type === "integer") {
        let integer = z.number().int()
        if (property.minimum !== undefined) integer = integer.min(property.minimum)
        if (property.maximum !== undefined) integer = integer.max(property.maximum)
        field = integer
      }
      field = field.describe(property.description)
      return [key, schema.required?.includes(key) ? field : field.optional()]
    }),
  )

const textResult = (text: string, isError = false): CallToolResult => ({ content: [{ type: "text", text }], ...(isError ? { isError } : {}) })

const registerTools = (server: McpServer, source: DataSource) => {
  for (const tool of toolDefinitions as readonly ToolDefinition[]) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: z.object(toZodShape(tool.inputSchema)),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      async (input: unknown) => {
        try {
          return textResult(await runTool(tool.name, source, input))
        } catch (error) {
          if (error instanceof ToolError) return textResult(error.message, true)
          throw error
        }
      },
    )
  }
}

const registerResources = (server: McpServer, source: DataSource) => {
  for (const { name, uri, title, description, mimeType, read } of resourceDefinitions) {
    server.registerResource(name, uri, { title, description, mimeType }, async (requested) => ({
      contents: [{ uri: requested.href, mimeType, text: await read(source) }],
    }))
  }

  server.registerResource(
    "post",
    new ResourceTemplate(POST_RESOURCE_TEMPLATE, {
      list: async () => ({
        resources: (await getPosts(source)).posts.map((post) => ({ uri: `site://posts/${post.slug}`, name: post.slug, title: post.title, description: post.description, mimeType: "text/markdown" })),
      }),
    }),
    { title: "Post", description: "One blog post as markdown.", mimeType: "text/markdown" },
    async (requested, variables) => {
      const slug = Array.isArray(variables.slug) ? variables.slug[0] : variables.slug
      return { contents: [{ uri: requested.href, mimeType: "text/markdown", text: await runTool("get_post", source, { slug }) }] }
    },
  )
}

const createServer = (env: McpEnv, origin: string): McpServer => {
  const server = new McpServer({ name: "andrew-codes", version: "1.0.0" })
  const source = createAssetSource(env.ASSETS, origin)

  registerTools(server, source)
  registerResources(server, source)
  return server
}

const handleMcp = (request: Request, env: McpEnv, ctx: ExecutionContext): Promise<Response> => {
  const { origin } = new URL(request.url)

  return createMcpHandler(() => createServer(env, origin), { route: ROUTE })(request, env, ctx)
}

export { ROUTE as MCP_ROUTE, createAssetSource, createServer, handleMcp }
export type { AssetsBinding, McpEnv }
