import type { Config } from "@react-router/dev/config"
import { getPrerenderPaths, getSiteGraph } from "./app/libs/agent/site-graph.server"

export default {
  ssr: false,
  prerender: async () => getPrerenderPaths(await getSiteGraph()),
} satisfies Config
