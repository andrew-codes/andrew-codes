import { describe, expect, it } from "vitest"
import { buildPersonJsonLd } from "../agent/resume"
import { buildSiteGraph } from "../agent/site-graph.server"
import { buildBlogPostingJsonLd, buildProfilePageJsonLd, personId } from "../structured-data"

const graph = buildSiteGraph([])
const person = buildPersonJsonLd(graph)

describe("buildProfilePageJsonLd", () => {
  const profilePage = buildProfilePageJsonLd(person) as Record<string, any>

  it("is a schema.org ProfilePage for the home page", () => {
    expect(profilePage).toMatchObject({ "@context": "https://schema.org", "@type": "ProfilePage", url: "https://andrew.codes/" })
  })

  it("carries the Person as mainEntity under the stable id, without a nested @context", () => {
    expect(profilePage.mainEntity).toMatchObject({ "@type": "Person", "@id": personId, name: "James Andrew Smith", jobTitle: "Staff Software Engineer" })
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

    expect(author["@id"]).toBe(personId)
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
