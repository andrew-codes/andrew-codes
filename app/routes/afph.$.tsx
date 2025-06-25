import type { ActionFunction, LoaderFunction } from "@remix-run/node"

const API_HOST = "us.i.posthog.com"
const ASSET_HOST = "us-assets.i.posthog.com"

const posthogProxy = async (request: Request) => {
  const url = new URL(request.url)
  const hostname = url.pathname.startsWith("/afph/static/")
    ? ASSET_HOST
    : API_HOST

  const newUrl = new URL(url)
  newUrl.protocol = "https"
  newUrl.hostname = hostname
  newUrl.port = "443"
  newUrl.pathname = newUrl.pathname.replace(/^\/afph/, "")

  const headers = new Headers(request.headers)
  headers.delete("Content-Encoding")
  headers.delete("Content-Length")
  headers.delete("Accept-Encoding")
  headers.set("host", hostname)

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    fetchOptions.body = request.body
    fetchOptions.duplex = "half"
  }
  const response = await fetch(newUrl, fetchOptions)

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete("Content-Encoding")
  responseHeaders.delete("Content-Length")
  responseHeaders.delete("transfer-encoding")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}

const loader: LoaderFunction = async ({ request }) => posthogProxy(request)

const action: ActionFunction = async ({ request }) => posthogProxy(request)

export { action, loader }
