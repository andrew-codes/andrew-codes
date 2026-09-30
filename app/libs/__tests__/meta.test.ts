import type { MetaDescriptor } from "react-router"
import { describe, expect, it } from "vitest"
import { buildMeta, toCanonicalUrl } from "../meta"

const find = (meta: MetaDescriptor[], key: "name" | "property", value: string) => meta.filter((entry) => key in entry && (entry as Record<string, unknown>)[key] === value)

const content = (meta: MetaDescriptor[], key: "name" | "property", value: string) => find(meta, key, value).map((entry) => (entry as { content: string }).content)

describe("toCanonicalUrl", () => {
  it("resolves against the site origin with a trailing slash", () => {
    expect(toCanonicalUrl("/")).toBe("https://andrew.codes/")
    expect(toCanonicalUrl("/posts")).toBe("https://andrew.codes/posts/")
    expect(toCanonicalUrl("/posts/my-post/")).toBe("https://andrew.codes/posts/my-post/")
  })

  it("drops query strings and fragments", () => {
    expect(toCanonicalUrl("/recommendations?priority=featured#top")).toBe("https://andrew.codes/recommendations/")
  })

  it("keeps percent-encoded path segments encoded", () => {
    expect(toCanonicalUrl(`/tags/${encodeURIComponent("voice assistant")}`)).toBe("https://andrew.codes/tags/voice%20assistant/")
  })
})

describe("buildMeta", () => {
  const base = { title: "Andrew Smith | Posts", description: "All my posts.", path: "/posts" }

  it("emits title, description and a canonical link", () => {
    const meta = buildMeta(base)

    expect(meta).toContainEqual({ title: "Andrew Smith | Posts" })
    expect(content(meta, "name", "description")).toEqual(["All my posts."])
    expect(meta).toContainEqual({ tagName: "link", rel: "canonical", href: "https://andrew.codes/posts/" })
  })

  it("emits a page-specific og:url that matches the canonical, and og:type website by default", () => {
    const meta = buildMeta(base)

    expect(content(meta, "property", "og:url")).toEqual(["https://andrew.codes/posts/"])
    expect(content(meta, "property", "og:type")).toEqual(["website"])
    expect(content(meta, "property", "og:title")).toEqual(["Andrew Smith | Posts"])
    expect(content(meta, "property", "og:description")).toEqual(["All my posts."])
  })

  it("advertises the markdown twin as an absolute alternate link when there is one", () => {
    const meta = buildMeta({ ...base, markdownPath: "/posts.md" })

    expect(meta).toContainEqual({ tagName: "link", rel: "alternate", type: "text/markdown", href: "https://andrew.codes/posts.md" })
  })

  it("keeps a percent-encoded twin path encoded", () => {
    const meta = buildMeta({ ...base, markdownPath: `/tags/${encodeURIComponent("voice assistant")}.md` })

    expect(meta).toContainEqual({ tagName: "link", rel: "alternate", type: "text/markdown", href: "https://andrew.codes/tags/voice%20assistant.md" })
  })

  it("emits no markdown alternate for a page without a twin", () => {
    expect(buildMeta(base).some((entry) => (entry as Record<string, unknown>).type === "text/markdown")).toBe(false)
  })

  it("uses an absolute og:image", () => {
    expect(content(buildMeta(base), "property", "og:image")).toEqual(["https://andrew.codes/images/andrew-smith.webp"])
  })

  it("does not emit article tags for a website page", () => {
    const meta = buildMeta({ ...base, article: { publishedTime: "2026-08-10", tags: ["nix"], section: "engineering" } })

    expect(find(meta, "property", "article:published_time")).toEqual([])
    expect(find(meta, "property", "article:tag")).toEqual([])
  })

  it("emits article tags for a post, one article:tag per tag", () => {
    const meta = buildMeta({
      ...base,
      path: "/posts/devtools-declared",
      type: "article",
      article: { publishedTime: "2026-08-10", tags: ["devtools", "nix"], section: "engineering" },
    })

    expect(content(meta, "property", "og:type")).toEqual(["article"])
    expect(content(meta, "property", "og:url")).toEqual(["https://andrew.codes/posts/devtools-declared/"])
    expect(content(meta, "property", "article:published_time")).toEqual(["2026-08-10"])
    expect(content(meta, "property", "article:section")).toEqual(["engineering"])
    expect(content(meta, "property", "article:tag")).toEqual(["devtools", "nix"])
  })

  it("omits article tags that have no value", () => {
    const meta = buildMeta({ ...base, type: "article", article: {} })

    expect(find(meta, "property", "article:published_time")).toEqual([])
    expect(find(meta, "property", "article:section")).toEqual([])
    expect(find(meta, "property", "article:tag")).toEqual([])
  })

  it("emits each JSON-LD object as its own script:ld+json entry", () => {
    const first = { "@context": "https://schema.org", "@type": "ProfilePage" }
    const second = { "@context": "https://schema.org", "@type": "BlogPosting" }
    const meta = buildMeta({ ...base, jsonLd: [first, second] })

    expect(meta.filter((entry) => "script:ld+json" in entry)).toEqual([{ "script:ld+json": first }, { "script:ld+json": second }])
  })

  it("emits no JSON-LD unless asked", () => {
    expect(JSON.stringify(buildMeta(base))).not.toContain("ld+json")
  })

  it("does not emit a charset - that stays a literal tag in root.tsx", () => {
    expect(JSON.stringify(buildMeta(base))).not.toMatch(/charset/i)
  })
})
