import { recommendations } from "../data/recommendations"
import { renderRecommendationsMarkdown } from "../libs/agent/markdown-twins"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /recommendations.md, the markdown twin of /recommendations.
const loader = async () => markdownResponse(renderRecommendationsMarkdown(await getSiteGraph(), recommendations))

export { loader }
