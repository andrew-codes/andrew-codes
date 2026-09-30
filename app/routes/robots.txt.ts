import { buildRobotsTxt } from "../libs/agent/crawler-files.server"
import { getSiteGraph } from "../libs/agent/site-graph.server"

// Resource route: prerendered to build/client/robots.txt at build time.
const loader = async () =>
  new Response(buildRobotsTxt(await getSiteGraph()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })

export { loader }
