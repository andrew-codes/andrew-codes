import type { FC } from "react"
import type { HeadersFunction } from "@remix-run/node"
import { LiveReload, Outlet, Scripts } from "@remix-run/react"
import GlobalStyles from "./components/GlobalStyles"

const headers: HeadersFunction = () => {
  let cacheControlHeader = "public, s-maxage=60"
  if (process.env.NODE_ENV === "development") {
    cacheControlHeader = "no-cache"
  }

  return {
    "Cache-Control": cacheControlHeader,
  }
}

const App: FC<{}> = () => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      {typeof document === "undefined" ? "__HELMET__" : null}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {typeof document === "undefined" ? "__STYLES__" : null}
    </head>
    <body>
      <GlobalStyles />
      <Outlet />
      <Scripts />
      <LiveReload />
    </body>
  </html>
)

export default App
export { headers }
