import Box from "@mui/joy/Box"
import { CssVarsProvider } from "@mui/joy/styles"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { PropsWithChildren, type FC } from "react"
import { createHead } from "remix-island"
import { PHProvider } from "./analytics/PostHogProvider"
import Baseline from "./components/Baseline"
import avatar from "./public/images/Profile.webp"
import theme from "./theme"

const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="keywords"
      content="Software Engineer, Staff Engineer, Tech Lead, Full Stack Developer, JavaScript, React, Node.js"
    />
    <meta name="author" content="Andrew Smith" />
    <meta name="og:image" content={avatar} />
    <meta name="og:url" content="https://andrew.codes" />
    <meta name="og:type" content="website" />
    <meta name="og:site_name" content="Andrew Smith" />
    <meta name="og:locale" content="en_US" />
    <Meta />
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
    <link
      crossOrigin="anonymous"
      rel="stylesheet"
      type="text/css"
      href="/css/dracula.css"
    />
    <Links />
  </>
))

const App: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <PHProvider>
      <CssVarsProvider theme={theme}>
        <InitColorSchemeScript defaultMode="dark" />
        <Baseline>
          <Box
            sx={{
              width: "100vw",
              [theme.breakpoints.down("lg")]: {
                margin: 0,
                padding: theme.spacing(4, 3),
              },
              [theme.breakpoints.up("lg")]: {
                margin: theme.spacing(2, "auto"),
                maxWidth: "960px",
                "@media print": {
                  margin: "0 auto",
                  maxWidth: "unset",
                },
              },
              "@media print": {
                margin: "0 auto",
                padding: 0,
              },
            }}
          >
            <Outlet />
          </Box>
        </Baseline>
        <ScrollRestoration />
        <Scripts />
      </CssVarsProvider>
    </PHProvider>
  )
}

export default App
export { Head }
