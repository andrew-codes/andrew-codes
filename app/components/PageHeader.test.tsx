import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import PageHeader from "./PageHeader"

describe("PageHeader", () => {
  it("renders the site owner's name, title, and any children", () => {
    const html = renderToStaticMarkup(
      <PageHeader>
        <div>child content</div>
      </PageHeader>,
    )

    expect(html).toContain("Andrew Smith")
    expect(html).toContain("Staff Software Engineer")
    expect(html).toContain("child content")
  })
})
