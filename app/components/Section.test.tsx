import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Section, SectionHeader } from "./Section"

describe("Section", () => {
  it("renders its children", () => {
    const html = renderToStaticMarkup(
      <Section>
        <div>content</div>
      </Section>,
    )

    expect(html).toContain("content")
  })
})

describe("SectionHeader", () => {
  it("renders its title and any children", () => {
    const html = renderToStaticMarkup(
      <SectionHeader title="Featured">
        <button>View All</button>
      </SectionHeader>,
    )

    expect(html).toContain("Featured")
    expect(html).toContain("View All")
  })
})
