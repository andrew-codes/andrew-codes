import { hydrateRoot } from "react-dom/client"
import { startTransition } from "react"
import { RemixBrowser } from "@remix-run/react"

function hydrateApp() {
  startTransition(() => {
    hydrateRoot(document.body, <RemixBrowser />)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrateApp)
} else {
  window.setTimeout(hydrateApp, 1)
}
