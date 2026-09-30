import { describe, expect, it } from "vitest"
import { recommendations } from "../../../data/recommendations"
import { buildRecommendationsDocument } from "../recommendations-document"

const now = new Date("2026-09-30T23:59:59Z")

describe("buildRecommendationsDocument", () => {
  const document = buildRecommendationsDocument(recommendations, now)

  it("wraps the data in the shared envelope", () => {
    expect(document).toMatchObject({
      schema: "https://andrew.codes/agent/schema/v1",
      generatedAt: "2026-09-30",
      canonical: "https://andrew.codes/agent/recommendations.json",
    })
  })

  it("lists every recommendation with absolute urls and the public author fields", () => {
    const [first] = document.data.recommendations

    expect(document.data.recommendations).toHaveLength(recommendations.length)
    expect(first).toMatchObject({
      id: "denise-architetto",
      url: "https://andrew.codes/recommendations#denise-architetto",
      featured: true,
      author: {
        name: "Denise Architetto",
        title: "Principal Group Engineering Manager (Director)",
        company: { slug: "microsoft", name: "Microsoft" },
        image: "https://andrew.codes/images/denise.jpeg",
      },
    })
    expect(first.paragraphs).toEqual(recommendations[0].paragraphs)
  })

  it("adds no relationship field", () => {
    for (const recommendation of document.data.recommendations) {
      expect(recommendation).not.toHaveProperty("relationship")
      expect(recommendation.author).not.toHaveProperty("relationship")
    }
  })

  it("indexes recommendation ids by company slug", () => {
    expect(document.data.facets.company.microsoft).toContain("denise-architetto")
    expect(document.data.facets.company.calendly).toEqual(["micah-prescott"])
    expect(Object.values(document.data.facets.company).flat().sort()).toEqual(recommendations.map((r) => r.id).sort())
  })

  it("contains no email, phone, or mailto/tel values", () => {
    const serialized = JSON.stringify(document)

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
  })
})
