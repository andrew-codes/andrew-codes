import { PassThrough } from "node:stream"
import { createReadableStreamFromReadable } from "@react-router/node"
import { renderToPipeableStream } from "react-dom/server"
import type { EntryContext } from "react-router"
import { ServerRouter } from "react-router"
import configuration from "./libs/configuration.server"
import { getEnv } from "./libs/env.server"
import { routes as otherRoutes } from "./other-routes.server"

const ABORT_DELAY = 5_000
global.ENV = getEnv()

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  for (const handler of otherRoutes) {
    const otherRouteResponse = await handler(request, routerContext)
    if (otherRouteResponse) return otherRouteResponse
  }

  const env = configuration.getValue("nodeEnv").value
  if (env !== "production") {
    responseHeaders.set("Cache-Control", "no-store")
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={routerContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set("Content-Type", "text/html; charset=utf-8")

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
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

export async function handleDataRequest(response: Response) {
  return response
}
