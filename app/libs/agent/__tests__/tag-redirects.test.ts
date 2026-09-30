import fs from "fs"
import path from "path"
import { describe, expect, it } from "vitest"
import { topicForTag } from "../../../data/topics"

// Before topics, /tags/:id was the raw authored tag. These are all the tags the
// site had then; each one's old URL must still land on its topic page. Tags
// added since never had an old URL, so this list is fixed and never grows.
const LEGACY_TAGS = [
  "agents", "ai", "ansible", "automation", "bucketing", "craftsmanship", "devtools", "estimation", "forecasting", "graphql", "guests",
  "home assistant", "javascript", "jest", "kubernetes", "mocha", "nix", "node.js", "presence detection", "python", "react", "relay",
  "story points", "tdd", "voice assistant", "workflow", "zsh",
]

type Redirect = { from: string; to: string; status: number }

const redirects: Redirect[] = fs
  .readFileSync(path.resolve("app/public/_redirects"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [from, to, status] = line.split(/\s+/)
    return { from, to, status: Number(status) }
  })

const resolve = (url: string): string => {
  const match = redirects.find((redirect) => redirect.from === url)
  return match ? match.to : url
}

const withSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`)

describe("_redirects for old tag URLs", () => {
  it("is well formed: three fields, permanent, no duplicate sources", () => {
    for (const redirect of redirects) {
      expect(redirect.from).toMatch(/^\/\S+$/)
      expect(redirect.to).toMatch(/^\/\S+$/)
      expect(redirect.status).toBe(301)
    }
    const sources = redirects.map((redirect) => redirect.from)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it.each(LEGACY_TAGS)("keeps the old /tags/%s URL working, with or without a trailing slash", (tag) => {
    const oldUrl = `/tags/${encodeURIComponent(tag).replace(/'/g, "%27")}`
    const topicUrl = `/tags/${topicForTag(tag).slug}`

    for (const requested of [oldUrl, `${oldUrl}/`]) {
      // A URL that did not change needs no redirect; one that changed must have one.
      expect(withSlash(resolve(requested))).toBe(oldUrl === topicUrl ? withSlash(requested) : `${topicUrl}/`)
    }
  })

  it("sends /tags/featured to the posts page, which has the Featured section", () => {
    expect(resolve("/tags/featured")).toBe("/posts")
    expect(resolve("/tags/featured/")).toBe("/posts")
  })

  it("never redirects to something that redirects again", () => {
    for (const redirect of redirects) {
      expect(resolve(redirect.to)).toBe(redirect.to)
    }
  })

  it("does not redirect any URL that is a live topic page", () => {
    for (const tag of LEGACY_TAGS) {
      const live = `/tags/${topicForTag(tag).slug}`
      expect(redirects.map((redirect) => withSlash(redirect.from))).not.toContain(withSlash(live))
    }
  })
})
