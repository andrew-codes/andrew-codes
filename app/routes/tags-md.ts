import type { LoaderFunctionArgs } from "react-router"
import { renderTagMarkdown } from "../libs/agent/markdown-twins"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /tags/:id.md, the markdown twin of /tags/:id. The id is a
// topic slug, as on the page.
const loader = async ({ params }: LoaderFunctionArgs) => {
  const graph = await getSiteGraph()
  const topic = graph.topics.find((candidate) => candidate.slug === params.id)
  if (!topic) throw new Response("Not found", { status: 404 })

  return markdownResponse(renderTagMarkdown(graph, topic.slug))
}

export { loader }
