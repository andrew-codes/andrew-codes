import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { recommendations } from "../../data/recommendations"
import RecommendationCard from "../RecommendationCard"

describe("RecommendationCard", () => {
  it("renders the author, employer, first paragraph and anchor id from the data", () => {
    const [denise] = recommendations
    const html = renderToStaticMarkup(<RecommendationCard recommendation={denise} />)

    expect(html).toContain('id="denise-architetto"')
    expect(html).toContain("Denise Architetto")
    expect(html).toContain("Principal Group Engineering Manager (Director)")
    expect(html).toContain("Microsoft")
    expect(html).toContain('src="/images/denise.jpeg"')
    expect(html).toContain(denise.paragraphs[0].split(" ").slice(0, 6).join(" "))
    expect(html).toContain("Read more")
  })
})
