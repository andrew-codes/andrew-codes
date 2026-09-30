import { renderHomeMarkdown } from "../libs/agent/markdown-twins"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /index.md, the markdown twin of the home page.
const loader = async () => markdownResponse(renderHomeMarkdown(await getSiteGraph()))

export { loader }
