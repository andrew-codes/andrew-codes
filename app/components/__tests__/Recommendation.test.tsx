import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import Recommendation from "../Recommendation"

describe("Recommendation", () => {
  it("renders the name, title, and company", () => {
    const html = renderToStaticMarkup(
      <Recommendation profileImage="/avatar.jpg" name="Jane Doe" title="Engineering Manager" company="Acme">
        <p>Great to work with.</p>
      </Recommendation>,
    )

    expect(html).toContain("Jane Doe")
    expect(html).toContain("Engineering Manager")
    expect(html).toContain("Acme")
  })

  it("shows only the first child and a Read more affordance when summarized", () => {
    const html = renderToStaticMarkup(
      <Recommendation profileImage="/avatar.jpg" name="Jane Doe" title="Engineering Manager" company="Acme" summarized>
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </Recommendation>,
    )

    expect(html).toContain("First paragraph.")
    expect(html).not.toContain("Second paragraph.")
    expect(html).toContain("Read more")
  })

  it("shows no Read more affordance when not summarized", () => {
    const html = renderToStaticMarkup(
      <Recommendation profileImage="/avatar.jpg" name="Jane Doe" title="Engineering Manager" company="Acme">
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </Recommendation>,
    )

    expect(html).toContain("First paragraph.")
    expect(html).not.toContain("Read more")
  })
})
