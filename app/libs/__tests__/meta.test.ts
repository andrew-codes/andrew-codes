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

  it("uses an absolute og:image", () => {
    expect(content(buildMeta(base), "property", "og:image")).toEqual(["https://andrew.codes/images/andrew-smith.webp"])
  })

  it("does not emit article tags for a website page", () => {
    const meta = buildMeta({ ...base, article: { publishedTime: "2026-08-10", tags: ["nix"], section: "engineering" } })

    expect(find(meta, "property", "article:published_time")).toEqual([])
    expect(find(meta, "property", "article:tag")).toEqual([])
  })

  it("emits article tags for a post, one article:tag per tag and never the featured flag", () => {
    const meta = buildMeta({
      ...base,
      path: "/posts/devtools-declared",
      type: "article",
      article: { publishedTime: "2026-08-10", tags: ["devtools", "nix", "featured"], section: "engineering" },
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

  it("does not emit a charset - that stays a literal tag in root.tsx", () => {
    expect(JSON.stringify(buildMeta(base))).not.toMatch(/charset/i)
  })
})
