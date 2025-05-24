import { createRequestHandler } from "@remix-run/express"
import { installGlobals } from "@remix-run/node"
import compression from "compression"
import "dotenv/config"
import express from "express"
import fs from "fs"
import helmet from "helmet"
import { getInstanceInfo } from "litefs-js"
import Mixpanel from "mixpanel"
import morgan from "morgan"
import serverTiming from "server-timing"
import configuration from "./app/libs/configuration.server.js"
import { getMdxPages } from "./app/libs/mdx.server.js"
import { getRedirectsMiddleware } from "./server/redirects.js"

installGlobals()

const mp = Mixpanel.init(process.env.MIXPANEL_TOKEN ?? "")

const primaryHost = "andrew.codes"
const getHost = (req: { get: (key: string) => string | undefined }) =>
  req.get("X-Forwarded-Host") ?? req.get("host") ?? ""

const MODE = configuration.getValue("nodeEnv").value

const app = express()

app.use(serverTiming())

app.use(async (req, res, next) => {
  const { currentInstance, primaryInstance } = await getInstanceInfo()
  res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown")
  res.set("X-Fly-App", process.env.FLY_APP_NAME ?? "unknown")
  res.set("X-Fly-Instance", currentInstance)
  res.set("X-Fly-Primary-Instance", primaryInstance)
  res.set("X-Frame-Options", "SAMEORIGIN")

  const host = getHost(req)
  if (!host.endsWith(primaryHost)) {
    res.set("X-Robots-Tag", "noindex")
  }
  res.set("Access-Control-Allow-Origin", `https://${host}`)

  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`)
  next()
})

app.use(async (req, res, next) => {
  if (req.get("cf-visitor")) {
    // console.log(`👺 disallowed cf-visitor`, req.headers)
    // Make them wait for it...
    await new Promise((resolve) => setTimeout(resolve, 90_000))
    return res.send(
      `Please go to https://${primaryHost} instead! Ping Andrew if you think you should not be seeing this...`,
    )
  } else {
    return next()
  }
})

app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto")
  const host = getHost(req)
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https")
    res.redirect(`https://${host}${req.originalUrl}`)
    return
  }
  next()
})

app.all(
  "*",
  getRedirectsMiddleware({
    redirectsString: fs.readFileSync("server/_redirects.txt", "utf8"),
  }),
)

app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/")
    res.redirect(301, safepath + query)
  } else {
    next()
  }
})

app.use(
  morgan((tokens, req, res) => {
    const host = getHost(req)
    return [
      tokens.method?.(req, res),
      `${host}${tokens.url?.(req, res)}`,
      tokens.status?.(req, res),
      tokens.res?.(req, res, "content-length"),
      "-",
      tokens["response-time"]?.(req, res),
      "ms",
    ].join(" ")
  }),
)

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        "connect-src": MODE === "development" ? ["ws:", "'self'"] : null,
        "font-src": ["'self'"],
        "frame-src": ["'self'", "https://www.youtube.com"],
        "img-src": ["'self'", "data:"],
        "media-src": ["'self'", "data:", "blob:", "https://www.youtube.com"],
        "script-src": ["'unsafe-inline'", "'unsafe-eval'", "'self'"],
        "script-src-attr": ["'unsafe-inline'"],
        "upgrade-insecure-requests": null,
      },
    },
  }),
)

app.use(compression())

let viteDevServer: any = null
if (process.env.NODE_ENV != "production") {
  viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  )
}
app.use(
  viteDevServer ? viteDevServer.middlewares : express.static("build/client"),
)

app.use(express.static("app/public", { maxAge: "1y" }))

let build: any

if (process.env.NODE_ENV === "production") {
  build = await import("./build/server/index.js")
}
if (process.env.NODE_ENV !== "production") {
  build = () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
}

app.all("*", (req, res, next) => {
  createRequestHandler({ build, mode: MODE })(req, res, next)
  mp.track("pageview", {
    ip: req.ip,
    distinct_id: req.ip,
  })
})

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send("Error")
})

const port = process.env.PORT ?? 8080
getMdxPages(
  { forceFresh: true, timings: {} },
  "app/posts",
  "app/components",
).then(() => {
  app.listen(port, () => {
    console.log(`Production express server listening on port ${port}`)
  })
})
