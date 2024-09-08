import { type EntryContext } from "@remix-run/node"

type Handler = (
  request: Request,
  remixContext: EntryContext,
) => Promise<Response | null> | null

const pathedRoutes: Record<string, Handler> = {}

const routes: Array<Handler> = [
  ...Object.entries(pathedRoutes).map(([path, handler]) => {
    return (request: Request, remixContext: EntryContext) => {
      if (new URL(request.url).pathname !== path) return null

      return handler(request, remixContext)
    }
  }),
]

export { pathedRoutes, routes }
