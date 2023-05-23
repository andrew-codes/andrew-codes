import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { FC } from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import GlobalStyles from "./components/GlobalStyles"
import GlobalNav from "./components/MainNav"

const Root = styled.div`
  max-width: 1200px;
  min-width: 390px;
  margin: 0 auto;

  > * {
    margin: 0 2rem;
    text-size-adjust: 100%;

    @media (max-width: 600px) {
      margin: 0 0.5rem;
    }
  }
`

const App: FC<{}> = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preload" as="font" href="/fonts/Lato-Regular.ttf" />
        <link rel="preload" as="font" href="/fonts/Lato-Bold.ttf" />
        <link rel="preload" as="font" href="/fonts/Lato-Thin.ttf" />
        <link rel="preload" as="font" href="/fonts/Lato-Black.ttf" />
        <link rel="preload" as="font" href="/fonts/Lato-Light.ttf" />
        <link rel="stylesheet" type="text/css" href="/css/dracula.css" />
      </Helmet>
      <Links />
      <GlobalStyles />
      <GlobalNav />
      <Root>
        <Outlet />
      </Root>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}

export default App
