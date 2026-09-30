import { buildSitemapXml } from "../libs/agent/crawler-files.server"
import { getSiteGraph } from "../libs/agent/site-graph.server"

// Resource route: prerendered to build/client/sitemap.xml at build time.
const loader = async () =>
  new Response(buildSitemapXml(await getSiteGraph()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })

export { loader }
