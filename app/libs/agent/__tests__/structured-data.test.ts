import { describe, expect, it } from "vitest"
import { recommendations } from "../../../data/recommendations"
import { PERSON_ID, buildReviewJsonLd } from "../structured-data"

describe("buildReviewJsonLd", () => {
  const jsonLd = buildReviewJsonLd(recommendations)

  it("emits one Review per recommendation in a schema.org graph", () => {
    expect(jsonLd["@context"]).toBe("https://schema.org")
    expect(jsonLd["@graph"]).toHaveLength(recommendations.length)
    for (const node of jsonLd["@graph"]) expect(node["@type"]).toBe("Review")
  })

  it("describes the author and employer and reviews the site owner", () => {
    const [denise] = jsonLd["@graph"]

    expect(denise).toEqual({
      "@type": "Review",
      "@id": "https://andrew.codes/recommendations#denise-architetto",
      reviewBody: recommendations[0].paragraphs.join("\n\n"),
      author: {
        "@type": "Person",
        name: "Denise Architetto",
        jobTitle: "Principal Group Engineering Manager (Director)",
        image: "https://andrew.codes/images/denise.jpeg",
        worksFor: { "@type": "Organization", name: "Microsoft" },
      },
      itemReviewed: { "@type": "Person", "@id": PERSON_ID, name: "James Andrew Smith" },
    })
    expect(PERSON_ID).toBe("https://andrew.codes/#me")
  })

  it("contains no email, phone, or mailto/tel values", () => {
    const serialized = JSON.stringify(jsonLd)

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
  })
})
