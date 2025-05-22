import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { StyleProvider } from "./components/StyleProvider"

function hydrateApp() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StyleProvider>
          <RemixBrowser />
        </StyleProvider>
      </StrictMode>,
    )
  })
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrateApp)
} else {
  window.setTimeout(hydrateApp, 1)
}
