import { hydrateRoot } from "react-dom/client"
import { startTransition, StrictMode } from "react"
import { RemixBrowser } from "@remix-run/react"
// import { hydrate } from "react-dom"

// hydrate(<RemixBrowser />, document)
startTransition(() => {
  hydrateRoot(document.body, <RemixBrowser />)
})
