import { buildAtomFeed } from "../libs/agent/crawler-files.server"
import { getSiteGraph } from "../libs/agent/site-graph.server"

// Resource route: prerendered to build/client/feed.xml at build time.
const loader = async () =>
  new Response(buildAtomFeed(await getSiteGraph()), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  })

export { loader }
