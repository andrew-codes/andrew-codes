import Box from "@mui/joy/Box"
import { CssVarsProvider } from "@mui/joy/styles"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router"
import { type FC } from "react"
import { PHProvider } from "./analytics/PostHogProvider"
import Baseline from "./components/Baseline"
import theme from "./theme"

const avatar = "/images/Profile.webp"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Software Engineer, Staff Engineer, Tech Lead, Full Stack Developer, JavaScript, React, Node.js" />
        <meta name="author" content="Andrew Smith" />
        <meta name="og:image" content={avatar} />
        <meta name="og:url" content="https://andrew.codes" />
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content="Andrew Smith" />
        <meta name="og:locale" content="en_US" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export const meta = () => [{ charSet: "utf-8" }]

export const links = () => [
  { rel: "icon", href: "/images/favicon.ico" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon-16x16.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/images/apple-touch-icon.png" },
  { rel: "preload", as: "font", type: "font/ttf", href: "/fonts/Lato-Regular.ttf", crossOrigin: "anonymous" },
  { rel: "preload", as: "font", type: "font/ttf", href: "/fonts/Lato-Bold.ttf", crossOrigin: "anonymous" },
  { rel: "preload", as: "font", type: "font/ttf", href: "/fonts/Lato-Black.ttf", crossOrigin: "anonymous" },
  { rel: "stylesheet", type: "text/css", href: "/css/fonts.css" },
  { rel: "stylesheet", type: "text/css", href: "/css/dracula.css", crossOrigin: "anonymous" },
]

const App: FC = () => {
  return (
    <PHProvider>
      <CssVarsProvider theme={theme}>
        <InitColorSchemeScript defaultMode="dark" />
        <Baseline>
          <Box
            sx={{
              width: "100vw",
              minWidth: "380px",
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
      </CssVarsProvider>
    </PHProvider>
  )
}

export default App
