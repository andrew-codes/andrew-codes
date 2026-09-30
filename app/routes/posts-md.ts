import type { LoaderFunctionArgs } from "react-router"
import { renderPostMarkdown } from "../libs/agent/markdown-twins"
import { getPostMarkdown } from "../libs/agent/post-markdown.server"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { markdownResponse } from "../libs/agent/text-response"

// Resource route for /posts/:id.md, the markdown twin of /posts/:id. React
// Router ranks the literal `.md` suffix above the page's bare `:id`, so the two
// never collide; prerendered, this writes build/client/posts/:id.md.
const loader = async ({ params }: LoaderFunctionArgs) => {
  const graph = await getSiteGraph()
  const post = graph.posts.find((candidate) => candidate.slug === params.id)
  if (!post) throw new Response("Not found", { status: 404 })

  return markdownResponse(renderPostMarkdown(graph, post, await getPostMarkdown(post.slug)))
}

export { loader }
