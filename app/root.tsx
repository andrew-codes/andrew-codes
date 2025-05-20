import styled from "@emotion/styled"
import { Links, Meta, MetaFunction, Outlet, Scripts } from "@remix-run/react"
import { LinksFunction } from "@remix-run/server-runtime"
import type { FC } from "react"
import { Helmet } from "react-helmet"
import { createHead } from "remix-island"
import { Header } from "./components/Category"
import GlobalStyles from "./components/GlobalStyles"
import Link from "./components/Link"
import GlobalNav from "./components/MainNav"
import { Blockquote, Paragraph } from "./components/Post"
import { Page } from "./components/resume"
import { useNonce } from "./libs/NonceProvider"

const meta: MetaFunction = () => {
  return [
    {
      property: "og:title",
      content: "Senior Software Engineer",
    },
    {
      name: "description",
      content: "Professional profile of Andrew Smith.",
    },
    {
      name: "viewport",
      content: "initial-scale=1, width=device-width",
    },
    {
      charSet: "utf-8",
    },
  ]
}

const links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "/fonts/Lato-Regular.ttf",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "/fonts/Lato-Bold.ttf",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "/fonts/Lato-Thin.ttf",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "/fonts/Lato-Black.ttf",
      as: "font",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "/fonts/Lato-Light.ttf",
      as: "font",
      crossOrigin: "anonymous",
    },

    {
      crossOrigin: "anonymous",
      rel: "stylesheet",
      type: "text/css",
      href: "/css/dracula.css",
    },
  ]
}

const Head = createHead(() => (
  <>
    <link rel="icon" href="/images/favicon.ico" />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/images/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/images/favicon-16x16.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/images/apple-touch-icon.png"
    />
    <Meta />
    <Links />
  </>
))

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

  return (
    <>
      <Head />
      <GlobalStyles />
      <GlobalNav />
      <Root>
        <Outlet />
      </Root>
      <Scripts nonce={nonce} />
    </>
  )
}

const ErrorBoundary: FC<{}> = () => {
  const nonce = useNonce()

  return (
    <>
      <Head />
      <GlobalStyles />
      <GlobalNav />
      <Root>
        <Helmet title="Oops... | Andrew Smith" />
        <Page>
          <Header category={null}>
            <h1>Oops...</h1>
          </Header>
          <section>
            <Paragraph>
              Well that's embarrassing! There's been an error, but don't worry,
              you can use the main navigation to head back to the homepage.
            </Paragraph>
            <Blockquote>
              If you feel you're seeing this message in error, please feel free
              to contact me or open a{" "}
              <Link to="https://github.com/andrew-codes/andrew-codes/issues/new">
                GitHub issue
              </Link>
              . No pressure though!
            </Blockquote>
          </section>
        </Page>
      </Root>
      <Scripts nonce={nonce} />
    </>
  )
}

export default App
export { Head, links, meta }
