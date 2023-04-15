import type { FC } from "react"
import { LiveReload, Outlet, Scripts } from "@remix-run/react"
import GlobalStyles from "./components/GlobalStyles"
import styled from "styled-components"
import GlobalNav from "./components/MainNav"

const Root = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  > * {
    margin: 0 2rem;
  }
`

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
      <link rel="stylesheet" type="text/css" href="/css/dracula.css" />
      {typeof document === "undefined" ? "__STYLES__" : null}
    </head>
    <body>
      <GlobalStyles />
      <GlobalNav />
      <Root>
        <Outlet />
      </Root>
      <Scripts />
      <LiveReload />
    </body>
  </html>
)

export default App
