import styled from "@emotion/styled"
import { Links, LiveReload, Scripts, ScrollRestoration } from "@remix-run/react"
import type { FC, PropsWithChildren } from "react"
import favicon1024 from "../images/favicon-1024.png"
import favicon from "../images/favicon-48.png"
import { useNonce } from "../libs/NonceProvider"
import GlobalStyles from "./GlobalStyles"
import GlobalNav from "./MainNav"

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

const App: FC<PropsWithChildren<{}>> = ({ children }) => {
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
        <Links />
        <GlobalStyles />
        <GlobalNav />
        <Root>{children}</Root>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

export default App
