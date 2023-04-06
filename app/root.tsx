import type { FC } from "react"
import { LiveReload, Outlet, Scripts } from "@remix-run/react"
import GlobalStyles from "./components/GlobalStyles"

const App: FC<{}> = () => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      {typeof document === "undefined" ? "__HELMET__" : null}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <link rel="preload" as="font" href="/fonts/Lato-Regular.ttf" />
      <link rel="preload" as="font" href="/fonts/Lato-Bold.ttf" />
      <link rel="preload" as="font" href="/fonts/Lato-Thin.ttf" />
      <link rel="preload" as="font" href="/fonts/Lato-Black.ttf" />
      <link rel="preload" as="font" href="/fonts/Lato-Light.ttf" />
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
