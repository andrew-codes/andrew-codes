import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { FC } from "react"
import { Helmet } from "react-helmet"
import { MetronomeLinks } from "@metronome-sh/react"
import styled from "styled-components"
import GlobalStyles from "./components/GlobalStyles"
import GlobalNav from "./components/MainNav"
import { useNonce } from "./libs/NonceProvider"
import { useDeploymentUrlPrefix } from "./components/DeploymentEnvironment"

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
  const nonce = useNonce()
  const prefix = useDeploymentUrlPrefix()

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`${prefix}/fonts/Lato-Regular.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`${prefix}/fonts/Lato-Bold.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`${prefix}/fonts/Lato-Thin.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`${prefix}/fonts/Lato-Black.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`${prefix}/fonts/Lato-Light.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="stylesheet"
          type="text/css"
          href={`${prefix}/css/dracula.css`}
        />
      </Helmet>
      {prefix !== "" && <MetronomeLinks nonce={nonce} />}
      <Links />
      <GlobalStyles prefix={prefix} />
      <GlobalNav />
      <Root>
        <Outlet />
      </Root>
      <ScrollRestoration nonce={nonce} />
      <Scripts nonce={nonce} />
      <LiveReload nonce={nonce} />
    </>
  )
}

export default App
