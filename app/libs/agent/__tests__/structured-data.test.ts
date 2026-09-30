import { describe, expect, it } from "vitest"
import { recommendations } from "../../../data/recommendations"
import { buildPersonJsonLd } from "../resume"
import { buildSiteGraph } from "../site-graph.server"
import { PERSON_ID, buildBlogPostingJsonLd, buildProfilePageJsonLd, buildReviewJsonLd } from "../structured-data"

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

const graph = buildSiteGraph([])
const person = buildPersonJsonLd(graph)

describe("buildProfilePageJsonLd", () => {
  const profilePage = buildProfilePageJsonLd(person) as Record<string, any>

  it("is a schema.org ProfilePage for the home page", () => {
    expect(profilePage).toMatchObject({ "@context": "https://schema.org", "@type": "ProfilePage", url: "https://andrew.codes/" })
  })

  it("carries the Person as mainEntity under the stable id, without a nested @context", () => {
    expect(profilePage.mainEntity).toMatchObject({ "@type": "Person", "@id": PERSON_ID, name: "James Andrew Smith", jobTitle: "Staff Software Engineer" })
    expect(profilePage.mainEntity).not.toHaveProperty("@context")
  })

  it("does not modify the Person it wraps", () => {
    expect(person["@context"]).toBe("https://schema.org")
  })

  it("exposes no contact details", () => {
    const json = JSON.stringify(profilePage)

    expect(json).not.toMatch(/"(email|telephone|address|contactPoint)"/)
  })
})

describe("buildBlogPostingJsonLd", () => {
  const input = { slug: "devtools-declared", title: "Devtools, declared", description: "Declaring my tools.", date: "2026-08-10", category: "engineering", tags: ["devtools", "featured", "nix"] }

  it("describes the post with its canonical url and dates", () => {
    expect(buildBlogPostingJsonLd(input)).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Devtools, declared",
      description: "Declaring my tools.",
      url: "https://andrew.codes/posts/devtools-declared/",
      mainEntityOfPage: "https://andrew.codes/posts/devtools-declared/",
      datePublished: "2026-08-10",
      articleSection: "engineering",
      image: "https://andrew.codes/images/andrew-smith.webp",
    })
  })

  it("references the home page Person as author by the same @id", () => {
    const { author } = buildBlogPostingJsonLd(input) as Record<string, any>

    expect(author["@id"]).toBe(PERSON_ID)
    expect(author["@id"]).toBe(person["@id"])
    expect(author).toMatchObject({ "@type": "Person", name: "James Andrew Smith", url: "https://andrew.codes" })
  })

  it("lists topic tags as keywords and leaves out behaviour flags", () => {
    expect(buildBlogPostingJsonLd(input)).toHaveProperty("keywords", ["devtools", "nix"])
  })

  it("omits fields it has no value for", () => {
    const posting = buildBlogPostingJsonLd({ slug: "bare", title: "Bare", description: "d" })

    expect(posting).not.toHaveProperty("datePublished")
    expect(posting).not.toHaveProperty("articleSection")
    expect(posting).not.toHaveProperty("keywords")
  })

  it("percent-encodes the slug in the url", () => {
    expect(buildBlogPostingJsonLd({ ...input, slug: "a b" })).toHaveProperty("url", "https://andrew.codes/posts/a%20b/")
  })
})
