import { recommendations } from "../data/recommendations"
import { buildLlmsFullTxt } from "../libs/agent/llms"
import { renderPostMarkdown, renderRecommendationsMarkdown } from "../libs/agent/markdown-twins"
import { getPostMarkdown } from "../libs/agent/post-markdown.server"
import { buildResumeDocument, renderResumeMarkdown } from "../libs/agent/resume"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { plainTextResponse } from "../libs/agent/text-response"

// Resource route: prerendered to build/client/llms-full.txt at build time. The
// same renderers as the individual twins, so the two cannot drift apart.
const loader = async () => {
  const graph = await getSiteGraph()
  const posts = await Promise.all(graph.posts.map(async (post) => renderPostMarkdown(graph, post, await getPostMarkdown(post.slug))))

  return plainTextResponse(
    buildLlmsFullTxt(graph, [
      { markdown: renderResumeMarkdown(buildResumeDocument(graph)) },
      { markdown: renderRecommendationsMarkdown(graph, recommendations) },
      ...posts.map((markdown) => ({ markdown })),
    ]),
  )
}

export { loader }
