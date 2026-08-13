import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import { Layout } from "./root"

// Regression test for a production hydration crash (React error #418).
//
// Root cause: the document was served with no character encoding declared
// anywhere - not in the HTTP Content-Type header, and not as a <meta charset>
// tag in the HTML - because the charset was previously only declared via this
// route's `meta` export (`export const meta = () => [{ charSet: "utf-8" }]`).
// React Router's <Meta /> renders only the *last matched route's* meta array;
// it does not merge a leaf route's meta with its parent's. Since every leaf
// route in this app defines its own `meta` (for title/og tags), root's
// charSet entry was always silently dropped, on every page.
//
// With no explicit encoding at all, browsers fall back to a locale-based
// guess (commonly windows-1252), which mangles multi-byte UTF-8 characters
// (em dashes, curly quotes, etc.) while parsing the server-rendered HTML.
// When React then hydrates using the correctly-decoded string from the JS
// bundle, the two don't match and React throws a hydration error, discarding
// and re-rendering the affected subtree.
//
// The fix is a literal <meta charSet="utf-8" /> rendered unconditionally as
// the first child of <head>, in Layout, so it can never be dropped or
// reordered by a route's own meta.
describe("root Layout", () => {
  it("declares an explicit UTF-8 charset as the very first tag in <head>", () => {
    const Stub = createRoutesStub([
      {
        id: "root",
        path: "/",
        Component: () => (
          <Layout>
            <div>content</div>
          </Layout>
        ),
      },
    ])

    const html = renderToStaticMarkup(<Stub initialEntries={["/"]} />)

    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
    expect(headMatch).not.toBeNull()

    const head = headMatch![1]
    const firstTagMatch = head.match(/^\s*<[^>]+>/)
    expect(firstTagMatch).not.toBeNull()

    const firstTag = firstTagMatch![0]
    expect(firstTag).toMatch(/^<meta charSet="utf-8"/)
  })
})
