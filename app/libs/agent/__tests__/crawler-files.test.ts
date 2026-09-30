import { afterEach, describe, expect, it, vi } from "vitest"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildAtomFeed, buildRobotsTxt, buildSitemapXml, getSitemapEntries } from "../crawler-files.server"
import { buildSiteGraph } from "../site-graph.server"

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]> = {}): MdxPostSource => ({
  slug,
  listItem: {
    slug,
    frontmatter: { title: slug, description: `About ${slug}`, category: "engineering", ...frontmatter },
  },
})

const graph = buildSiteGraph([
  page("old", { date: "2023-02-03", tags: ["home assistant"] }),
  page("new", { date: "2024-09-18", tags: ["home assistant", "nix"], title: "Fish & <Chips>" }),
  page("undated"),
])

describe("buildRobotsTxt", () => {
  const robots = buildRobotsTxt(graph)

  it("allows everything, including AI search, input and training", () => {
    expect(robots).toContain("User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /")
    expect(robots).not.toMatch(/^Disallow:/m)
  })

  it("points at the sitemap", () => {
    expect(robots).toContain("Sitemap: https://andrew.codes/sitemap.xml")
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("getSitemapEntries", () => {
  const entries = getSitemapEntries(graph)
  const lastmodOf = (path: string) => entries.find((entry) => entry.loc === `https://andrew.codes${path}`)?.lastmod

  it("takes post lastmod from the front matter date", () => {
    expect(lastmodOf("/posts/old")).toBe("2023-02-03")
    expect(lastmodOf("/posts/new")).toBe("2024-09-18")
  })

  it("omits lastmod when a page has no date, rather than inventing one", () => {
    expect(entries.find((entry) => entry.loc.endsWith("/posts/undated"))).toEqual({ loc: "https://andrew.codes/posts/undated" })
    expect(lastmodOf("/recommendations")).toBeUndefined()
  })

  it("dates the home page, post list and tag pages by their newest post", () => {
    expect(lastmodOf("/")).toBe("2024-09-18")
    expect(lastmodOf("/posts")).toBe("2024-09-18")
    expect(lastmodOf("/tags/nix")).toBe("2024-09-18")
  })

  it("percent-encodes tags with spaces", () => {
    expect(lastmodOf("/tags/home%20assistant")).toBe("2024-09-18")
  })

  it("leaves out the QR connect card", () => {
    expect(entries.map((entry) => entry.loc)).not.toContain("https://andrew.codes/connect")
    expect(entries.map((entry) => entry.loc)).toContain("https://andrew.codes/connect-with-me")
  })

  it("does not depend on the build time", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z"))
    const first = [buildSitemapXml(graph), buildAtomFeed(graph)]
    vi.setSystemTime(new Date("2031-06-01T00:00:00Z"))

    expect([buildSitemapXml(graph), buildAtomFeed(graph)]).toEqual(first)
    expect(first.join("\n")).not.toMatch(/203\d/)
  })
})

describe("buildSitemapXml", () => {
  it("is a sitemap urlset", () => {
    const xml = buildSitemapXml(graph)

    expect(xml.startsWith(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)).toBe(true)
    expect(xml).toContain("<loc>https://andrew.codes/posts/new</loc>\n    <lastmod>2024-09-18</lastmod>")
  })
})

describe("buildAtomFeed", () => {
  const feed = buildAtomFeed(graph)

  it("is an Atom feed updated at the newest post date", () => {
    expect(feed).toContain(`<feed xmlns="http://www.w3.org/2005/Atom">`)
    expect(feed).toContain("<updated>2024-09-18T00:00:00Z</updated>")
    expect(feed).toContain(`<link rel="self" type="application/atom+xml" href="https://andrew.codes/feed.xml"/>`)
  })

  it("lists dated posts, newest first, and skips undated ones", () => {
    const ids = [...feed.matchAll(/<entry>\s*<id>([^<]+)<\/id>/g)].map((match) => match[1])

    expect(ids).toEqual(["https://andrew.codes/posts/new", "https://andrew.codes/posts/old"])
  })

  it("escapes XML in titles", () => {
    expect(feed).toContain("<title>Fish &amp; &lt;Chips&gt;</title>")
  })

  it("exposes only the public author fields", () => {
    expect(feed).toContain("<name>James Andrew Smith</name>")
    expect(feed).not.toMatch(/@|mailto:|tel:/)
  })
})
