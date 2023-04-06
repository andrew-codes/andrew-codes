import type { FC } from "react"
import { LiveReload, Outlet, Scripts } from "@remix-run/react"
import GlobalStyles from "./components/GlobalStyles"

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
