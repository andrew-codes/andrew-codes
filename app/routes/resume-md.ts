import { buildResumeDocument, renderResumeMarkdown } from "../libs/agent/resume"
import { getSiteGraph } from "../libs/agent/site-graph.server"

const loader = async () =>
  new Response(renderResumeMarkdown(buildResumeDocument(await getSiteGraph())), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })

export { loader }
