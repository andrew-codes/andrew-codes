import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { PassThrough } from "node:stream"
import { renderToPipeableStream } from "react-dom/server"
import { Helmet } from "react-helmet"
import { ServerStyleSheet } from "styled-components"
import type { HandleDocumentRequestFunction } from "@remix-run/node"
import isbot from "isbot"
import { ensurePrimary } from "litefs-js/remix"
import { routes as otherRoutes } from "./other-routes.server"
import { getEnv } from "./libs/env.server"
import { NonceProvider } from "./libs/NonceProvider"

const ABORT_DELAY = 5_000
global.ENV = getEnv()

// NOTE: we've got a patch-package on Remix that adds the loadContext argument
// so we can access the cspNonce in the entry. Hopefully this gets supported:
// https://github.com/remix-run/remix/discussions/4603
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
    // eslint-disable-next-line no-await-in-loop
    const otherRouteResponse = await handler(request, remixContext)
    if (otherRouteResponse) return otherRouteResponse
  }

  if (process.env.NODE_ENV !== "production") {
    responseHeaders.set("Cache-Control", "no-store")
  }

  // If the request is from a bot, we want to wait for the full
  // response to render before sending it to the client. This
  // ensures that bots can see the full page content.
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
  const sheet = new ServerStyleSheet()

  return new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(
      sheet.collectStyles(
        <NonceProvider value={nonce}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </NonceProvider>,
      ),
      {
        nonce,
        // Use onAllReady to wait for the entire document to be ready
        onAllReady() {
          responseHeaders.set("Content-Type", "text/html")
          const body = new PassThrough()

          const helmet = Helmet.renderStatic()
          body.write("<!DOCTYPE html>", "utf-8")
          body.write(
            `<html lang="en"><head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.style.toString()}${helmet.script.toString()}${sheet.getStyleTags()}</head><body>`,
            "utf-8",
          )
          stream.pipe(body)
          body.write(`</body></html>`, "utf-8")
          resolve(
            new Response(body, {
              status: responseStatusCode,
              headers: responseHeaders,
            }),
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
      },
    )
    setTimeout(() => stream.abort(), ABORT_DELAY)
  })
}

function serveBrowsers(...args: DocRequestArgs) {
  const [
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext,
  ] = args
  const nonce = loadContext.cspNonce ? String(loadContext.cspNonce) : undefined
  const sheet = new ServerStyleSheet()
  return new Promise((resolve, reject) => {
    let didError = false
    const stream = renderToPipeableStream(
      sheet.collectStyles(
        <NonceProvider value={nonce}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </NonceProvider>,
      ),
      {
        nonce,
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html")
          const body = new PassThrough()

          const helmet = Helmet.renderStatic()
          body.write("<!DOCTYPE html>", "utf-8")
          body.write(
            `<html lang="en"><head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.style.toString()}${helmet.script.toString()}${sheet.getStyleTags()}</head><body>`,
            "utf-8",
          )
          stream.pipe(body)
          body.write(`</body></html>`, "utf-8")

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          )
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(err: unknown) {
          didError = true
          console.error(err)
        },
      },
    )
    setTimeout(() => stream.abort(), ABORT_DELAY)
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
