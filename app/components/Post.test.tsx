import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Link, Paragraph } from "./Post"

// Regression test for a production hydration crash (React error #418,
// args[]=HTML) found on every post page that has a standalone image in its
// markdown - distinct from the charset (see root.test.tsx) and date/locale
// (see libs/utils.test.ts) mismatches also found in this investigation.
//
// Root cause: MDX/remark wraps a markdown paragraph that contains only an
// image ("![alt](src)" on its own line) in a <p>. This app's `img` override
// (Image, in this file) renders a block-level <div> wrapper for its
// full-bleed breakout positioning. A <div> is not permitted inside <p> per
// the HTML5 content model, so a browser parsing the prerendered HTML
// auto-closes the <p> before that <div> - producing a DOM shape that doesn't
// match the tree React asked for, and hydration fails.
//
// The fix: Paragraph (the `p` override) detects when its content is (or
// contains, e.g. a linked image) an image and renders it unwrapped, instead
// of inside a <p>.
const FakeImage = (props: { src: string; alt: string }) => (
  <img data-testid="image" src={props.src} alt={props.alt} />
)

describe("Paragraph", () => {
  it("renders ordinary text inside a <p>", () => {
    const html = renderToStaticMarkup(
      <Paragraph>Some ordinary paragraph text.</Paragraph>,
    )

    expect(html).toMatch(/<p[ >][^]*Some ordinary paragraph text\.[^]*<\/p>/)
  })

  it("does not wrap a standalone image in a <p>", () => {
    const html = renderToStaticMarkup(
      <Paragraph>
        <FakeImage src="/files/diagram.png" alt="A diagram" />
      </Paragraph>,
    )

    expect(html).not.toContain("<p")
    expect(html).toContain('data-testid="image"')
  })

  it("does not wrap a linked image (a markdown image inside a link) in a <p>", () => {
    const html = renderToStaticMarkup(
      <Paragraph>
        <Link href="https://example.com">
          <FakeImage src="/files/diagram.png" alt="A diagram" />
        </Link>
      </Paragraph>,
    )

    expect(html).not.toContain("<p")
    expect(html).toContain('data-testid="image"')
  })
})
