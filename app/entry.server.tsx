import { CacheProvider } from "@emotion/react"
import createEmotionServer from "@emotion/server/create-instance"
import type { HandleDocumentRequestFunction } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { isbot } from "isbot"
import { ensurePrimary } from "litefs-js/remix"
import { renderToString } from "react-dom/server"
import { Helmet } from "react-helmet"
import { renderHeadToString } from "remix-island"
import createEmotionCache from "./createEmotionCache"
import configuration from "./libs/configuration.server"
import { getEnv } from "./libs/env.server"
import { routes as otherRoutes } from "./other-routes.server"
import { Head } from "./root"

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
    const renderedOutput = renderToString(
      <CacheProvider value={clientSideCache}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </CacheProvider>,
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
    const clientSideCache = createEmotionCache()
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      createEmotionServer(clientSideCache)

    const renderedOutput = renderToString(
      <CacheProvider value={clientSideCache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>,
    )

    const chunks = extractCriticalToChunks(renderedOutput)
    const styles = constructStyleTagsFromChunks(chunks)

    const head = renderHeadToString({ request, remixContext, Head })

    const html =
      `<!DOCTYPE html><html lang="en-US"><head>${head}</head><body><div id="root">${renderedOutput}</div></body></html>`.replace(
        /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
        `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${styles}`,
      )

    responseHeaders.set("Content-Type", "text/html; charset=utf-8")
    resolve(
      new Response(html, {
        headers: responseHeaders,
        status: responseStatusCode,
      }),
    )
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
