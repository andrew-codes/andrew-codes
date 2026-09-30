import { startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />)
})

// WebMCP (an experimental browser API): expose the site's read-only agent
// tools when the browser has it. The check is repeated here so browsers
// without it never download the registration code.
if ("modelContext" in document || "modelContext" in navigator) {
  import("./libs/agent/webmcp").then(({ registerWebMcpTools }) => registerWebMcpTools()).catch(() => undefined)
}
