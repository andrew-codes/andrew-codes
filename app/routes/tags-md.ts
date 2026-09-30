import type { LoaderFunctionArgs } from "react-router"
import { renderTagMarkdown } from "../libs/agent/markdown-twins"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /tags/:id.md, the markdown twin of /tags/:id.
const loader = async ({ params }: LoaderFunctionArgs) => {
  const graph = await getSiteGraph()
  const tag = graph.tags.find((candidate) => candidate === params.id)
  if (!tag) throw new Response("Not found", { status: 404 })

  return markdownResponse(renderTagMarkdown(graph, tag))
}

export { loader }
