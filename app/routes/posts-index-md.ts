import { renderPostsIndexMarkdown } from "../libs/agent/markdown-twins"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /posts.md, the markdown twin of /posts.
const loader = async () => markdownResponse(renderPostsIndexMarkdown(await getSiteGraph()))

export { loader }
