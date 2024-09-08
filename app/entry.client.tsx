import { CacheProvider } from "@emotion/react"
import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import createEmotionCache from "./createEmotionCache"

const clientSideCache = createEmotionCache()

function hydrateApp() {
  startTransition(() => {
    hydrateRoot(
      document.getElementById("root"),
      <StrictMode>
        <CacheProvider value={clientSideCache}>
          <RemixBrowser />
        </CacheProvider>
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
