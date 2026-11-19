import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import PageHeader from "../PageHeader"

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

describe("PageHeader portrait", () => {
  it("renders an eager, high-priority profile image with alt text when given a portrait", () => {
    const html = renderToStaticMarkup(<PageHeader portrait={{ src: "/images/me.webp", alt: "A portrait" }} />)

    expect(html).toContain('src="/images/me.webp"')
    expect(html).toContain('alt="A portrait"')
    expect(html).toContain('loading="eager"')
  })

  it("renders no image without a portrait", () => {
    expect(renderToStaticMarkup(<PageHeader />)).not.toContain("<img")
  })
})
