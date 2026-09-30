import { getSiteGraph } from "../libs/agent/site-graph.server"
import { buildRecommendationsDocument } from "../libs/agent/recommendations-document"

const loader = async () => {
  const { recommendations } = await getSiteGraph()

  return new Response(`${JSON.stringify(buildRecommendationsDocument(recommendations), null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}

export { loader }
