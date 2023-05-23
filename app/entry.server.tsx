import { PassThrough } from "node:stream"
import type { EntryContext } from "@remix-run/node"
import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { renderToPipeableStream } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import { Helmet } from "react-helmet"

const ABORT_DELAY = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    const sheet = new ServerStyleSheet()

    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />,
      ),
      {
        onShellReady() {
          const body = new PassThrough()

          let cacheControlHeader = "public, max-age=300, s-maxage=3600"
          if (process.env.NODE_ENV === "development") {
            cacheControlHeader = "no-cache"
          }
          responseHeaders.set("Cache-Control", cacheControlHeader)
          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          const helmet = Helmet.renderStatic()
          body.write("<!DOCTYPE html>", "utf-8")
          body.write(
            `<html lang="en"><head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.style.toString()}${helmet.script.toString()}${sheet.getStyleTags()}</head><body>`,
            "utf-8",
          )
          pipe(body)
          body.write(`</body></html>`, "utf-8")
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          console.error(error)
          responseStatusCode = 500
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
