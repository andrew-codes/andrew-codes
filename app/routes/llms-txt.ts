import { buildLlmsTxt } from "../libs/agent/llms"
import { getSiteGraph } from "../libs/agent/site-graph.server"
import { plainTextResponse } from "../libs/agent/text-response"

// Resource route: prerendered to build/client/llms.txt at build time.
const loader = async () => plainTextResponse(buildLlmsTxt(await getSiteGraph()))

export { loader }
