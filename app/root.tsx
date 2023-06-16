import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { FC } from "react"
import { MetronomeLinks } from "@metronome-sh/react"
import styled from "styled-components"
import GlobalStyles from "./components/GlobalStyles"
import GlobalNav from "./components/MainNav"
import { useNonce } from "./libs/NonceProvider"
import favicon from "./images/favicon-48.png"
import favicon1024 from "./images/favicon-1024.png"

const Root = styled.div`
  max-width: 1200px;
  min-width: 390px;
  margin: 0 auto;

  > * {
    margin: 0 2rem;
    text-size-adjust: 100%;

    @media (max-width: 640px) {
      margin: 0 0.5rem;
    }
  }
`

const App: FC<{}> = () => {
  const nonce = useNonce()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`/fonts/Lato-Regular.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`/fonts/Lato-Bold.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`/fonts/Lato-Thin.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`/fonts/Lato-Black.ttf`}
        />
        <link
          crossOrigin="anonymous"
          rel="preload"
          as="font"
          href={`/fonts/Lato-Light.ttf`}
        />
        <meta name="og:title" content="Senior Software Engineer" />
        <meta name="og:type" content="website" />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon1024} />
        <link
          crossOrigin="anonymous"
          rel="stylesheet"
          type="text/css"
          href={`/css/dracula.css`}
        />
      </head>
      <body>
        <MetronomeLinks nonce={nonce} />
        <Links />
        <GlobalStyles />
        <GlobalNav />
        <Root>
          <Outlet />
        </Root>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

export default App
