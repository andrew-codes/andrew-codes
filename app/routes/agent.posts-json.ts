import { buildPostsDocument } from "../libs/agent/catalog"
import { getSiteGraph } from "../libs/agent/site-graph.server"

const loader = async () =>
  new Response(`${JSON.stringify(buildPostsDocument(await getSiteGraph()), null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })

export { loader }
