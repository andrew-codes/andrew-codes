import { createRequestHandler } from "@remix-run/express"
import compression from "compression"
import crypto from "crypto"
import express from "express"
import "express-async-errors"
import fs from "fs"
import morgan from "morgan"
import onFinished from "on-finished"
import path from "path"
import serverTiming from "server-timing"
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  combineGetLoadContexts,
  createMetronomeGetLoadContext,
  registerMetronome,
} from "@metronome-sh/express"
import helmet from "helmet"
import { getInstanceInfo } from "litefs-js"
import { getRedirectsMiddleware } from "./redirects"

const here = (...d: Array<string>) => path.join(__dirname, ...d)
const primaryHost = "andrew.codes"
const getHost = (req: { get: (key: string) => string | undefined }) =>
  req.get("X-Forwarded-Host") ?? req.get("host") ?? ""

const MODE = process.env.NODE_ENV
const BUILD_DIR = path.join(process.cwd(), "build")

const app = express()
app.use(serverTiming())

if (process.env.DISABLE_METRONOME) {
  app.post("/__metronome", (req, res) => {
    res.status(503)
    return res.send("Metronome is disabled")
  })
}

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
    redirectsString: fs.readFileSync(here("./_redirects.txt"), "utf8"),
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

app.use(compression())

const publicAbsolutePath = here("../public")

app.use(
  express.static(publicAbsolutePath, {
    maxAge: "1w",
    setHeaders(res, resourcePath) {
      const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "")
      if (relativePath.startsWith("build/info.json")) {
        res.setHeader("cache-control", "no-cache")
        return
      }
      // If we ever change our font (which we quite possibly never will)
      // then we'll just want to change the filename or something...
      // Remix fingerprints its assets so we can cache forever
      if (
        relativePath.startsWith("fonts") ||
        relativePath.startsWith("build") ||
        relativePath.startsWith("css")
      ) {
        res.setHeader("cache-control", "public, max-age=31536000, immutable")
      }
    },
  }),
)

// log the referrer for 404s
app.use((req, res, next) => {
  onFinished(res, () => {
    const referrer = req.get("referer")
    if (res.statusCode === 404 && referrer) {
      console.info(
        `👻 404 on ${req.method} ${req.path} referred by: ${referrer}`,
      )
    }
  })
  next()
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

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex")
  next()
})

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        "connect-src": MODE === "development" ? ["ws:", "'self'"] : null,
        "font-src": ["'self'"],
        "frame-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "media-src": ["'self'", "data:", "blob:"],
        "script-src": [
          "'strict-dynamic'",
          "'unsafe-eval'",
          "'self'",
          // @ts-expect-error
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        "script-src-attr": ["'unsafe-inline'"],
        "upgrade-insecure-requests": null,
      },
    },
  }),
)

function getRequestHandlerOptions(): Parameters<
  typeof createRequestHandler
>[0] {
  const build = require("../build")
  function getLoadContext(req: any, res: any) {
    return { cspNonce: res.locals.cspNonce }
  }
  if (MODE === "production" && !process.env.DISABLE_METRONOME) {
    const buildWithMetronome = registerMetronome(build)
    const metronomeGetLoadContext =
      createMetronomeGetLoadContext(buildWithMetronome)
    return {
      build: buildWithMetronome,
      getLoadContext: combineGetLoadContexts(
        getLoadContext,
        // @ts-expect-error huh... metronome isn't happy with itself.
        metronomeGetLoadContext,
      ),
      mode: MODE,
    }
  }

  return { build, mode: MODE, getLoadContext }
}

if (MODE === "production") {
  app.all("*", createRequestHandler(getRequestHandlerOptions()))
} else {
  app.all("*", (req, res, next) => {
    purgeRequireCache()
    return createRequestHandler(getRequestHandlerOptions())(req, res, next)
  })
}

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  require("../build")
  console.log(`Express server listening on port ${port}`)
})

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key]
    }
  }
}

/*
eslint
  @typescript-eslint/no-var-requires: "off",
*/
