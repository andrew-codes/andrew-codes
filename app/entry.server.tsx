import { CacheProvider } from "@emotion/react"
import type { HandleDocumentRequestFunction } from "@remix-run/node"
import { createReadableStreamFromReadable } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { isbot } from "isbot"
import { ensurePrimary } from "litefs-js/remix"
import mixpanel from "mixpanel"
import { PassThrough } from "node:stream"
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server"
import { Helmet } from "react-helmet"
import { StyleProvider } from "./components/StyleProvider"
import createEmotionCache from "./createEmotionCache"
import configuration from "./libs/configuration.server"
import { getEnv } from "./libs/env.server"
import { routes as otherRoutes } from "./other-routes.server"

const mp = mixpanel.init(process.env.MIXPANEL_TOKEN ?? "")

const ABORT_DELAY = 5_000
global.ENV = getEnv()

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

async function handleDocumentRequest(...args: DocRequestArgs) {
  const [
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
  ] = args
  if (responseStatusCode >= 500) {
    // if we had an error, let's just send this over to the primary and see
    // if it can handle it.
    await ensurePrimary()
  }

  for (const handler of otherRoutes) {
    const otherRouteResponse = await handler(request, remixContext)
    if (otherRouteResponse) return otherRouteResponse
  }

  const env = configuration.getValue("nodeEnv").value
  if (env !== "production") {
    responseHeaders.set("Cache-Control", "no-store")
  }

  if (isbot(request.headers.get("user-agent"))) {
    return serveTheBots(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      loadContext,
    )
  }

  return serveBrowsers(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
  )
}

function serveTheBots(...args: DocRequestArgs) {
  const [
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
  ] = args
  const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : undefined

  return new Promise((resolve, reject) => {
    const clientSideCache = createEmotionCache()
    const renderedOutput = renderToStaticMarkup(
      <>
        <CacheProvider value={clientSideCache}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </CacheProvider>
      </>,
    )

    const helmet = Helmet.renderStatic()

    responseHeaders.set("Content-Type", "text/html; charset=utf-8")
    resolve(
      new Response(
        `<!DOCTYPE html><html lang="en-US"><head>${helmet.link.toString()}</head><body><div id="root">${renderedOutput}</div></body></html>`,
        {
          headers: responseHeaders,
          status: responseStatusCode,
        },
      ),
    )
  })
}

function serveBrowsers(...args: DocRequestArgs) {
  let [
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
  ] = args
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <StyleProvider>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </StyleProvider>,
      {
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          mp.track("Error", {
            ip: request.headers.get("FLY_CLIENT_IP"),
            pathname: new URL(request.url).pathname,
            userAgent: request.headers.get("user-agent"),
          })
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

async function handleDataRequest(response: Response) {
  if (response.status >= 500) {
    await ensurePrimary()
  }

  return response
}

export default handleDocumentRequest
export { handleDataRequest }
