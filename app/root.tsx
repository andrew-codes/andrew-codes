import { withEmotionCache } from "@emotion/react"
import Box from "@mui/joy/Box"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { PropsWithChildren, useContext, type FC } from "react"
import Baseline from "./components/Baseline"
import ClientStylesContext from "./components/ClientStylesContext"
import avatar from "./public/images/Profile.webp"
import theme from "./theme"

const Layout = withEmotionCache(
  ({ children }: FC<PropsWithChildren<{}>>, emotionCache) => {
    const clientStyleData = useContext(ClientStylesContext)

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach((tag) => {
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData.reset()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html lang="en">
        <head>
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.background.body} />
          <Meta />
          <meta name="og:image" content={avatar} />
          <meta name="og:url" content="https://andrew.codes/" />
          <meta name="og:type" content="website" />
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
          <Links />
          <link
            crossOrigin="anonymous"
            rel="stylesheet"
            type="text/css"
            href="/css/dracula.css"
          />
        </head>
        <body>
          <InitColorSchemeScript defaultMode="dark" />
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
)

const App: FC<{}> = () => {
  return (
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
  )
}

export default App
export { Layout }
