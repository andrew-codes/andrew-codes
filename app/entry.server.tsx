import type { EntryContext } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { flow } from "lodash"
import { renderToString } from "react-dom/server"
import { Helmet } from "react-helmet"
import { ServerStyleSheet } from "styled-components"

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const sheet = new ServerStyleSheet()
  const App = sheet.collectStyles(
    <RemixServer context={remixContext} url={request.url} />,
  )

  let markup = renderToString(App)
  const helmet = Helmet.renderStatic()
  const styles = sheet.getStyleTags()

  const processMarkup = flow(
    (markup) => markup.replace("__STYLES__", `${styles}`),
    (markup) =>
      markup.replace(
        "__HELMET__",
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.style.toString()}${helmet.script.toString()}`,
      ),
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response("<!DOCTYPE html>" + processMarkup(markup), {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
