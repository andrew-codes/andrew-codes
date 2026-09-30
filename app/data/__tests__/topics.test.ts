import { describe, expect, it } from "vitest"
import { profile } from "../profile"
import { FEATURED_TAG, resolveTopic, resolveTopics, topics } from "../topics"

describe("topic vocabulary", () => {
  it("uses unique kebab-case slugs", () => {
    const slugs = topics.map((topic) => topic.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it("never maps one alias (or slug) onto two topics", () => {
    const keys = topics.flatMap((topic) => [...new Set([topic.slug, ...topic.aliases].map((key) => key.toLowerCase()))])

    expect(new Set(keys).size).toBe(keys.length)
  })

  it("does not treat the featured flag as a topic", () => {
    expect(resolveTopic(FEATURED_TAG)).toBeUndefined()
  })

  it("only lists expertise topics that exist", () => {
    for (const slug of profile.expertise) {
      expect(topics.map((topic) => topic.slug)).toContain(slug)
    }
  })
})

describe("resolveTopic", () => {
  it("resolves a slug, an alias, and is case and whitespace insensitive", () => {
    expect(resolveTopic("home-assistant")?.slug).toBe("home-assistant")
    expect(resolveTopic("home assistant")?.slug).toBe("home-assistant")
    expect(resolveTopic("  Node.JS ")?.slug).toBe("nodejs")
  })

  it("merges ai and agents into one topic", () => {
    expect(resolveTopic("ai")).toBe(resolveTopic("agents"))
  })

  it("returns undefined for an unknown tag", () => {
    expect(resolveTopic("underwater-basket-weaving")).toBeUndefined()
  })
})

describe("resolveTopics", () => {
  it("dedupes topics that several tags map onto, keeping first-seen order", () => {
    const { topics: resolved, unknown } = resolveTopics(["react", "agents", "ai", "graphql"])

    expect(resolved.map((topic) => topic.slug)).toEqual(["react", "ai", "graphql"])
    expect(unknown).toEqual([])
  })

  it("skips the featured flag and reports unknown tags as authored", () => {
    const { topics: resolved, unknown } = resolveTopics(["featured", "Mystery Tag", "nix"])

    expect(resolved.map((topic) => topic.slug)).toEqual(["nix"])
    expect(unknown).toEqual(["Mystery Tag"])
  })

  it("handles missing tags", () => {
    expect(resolveTopics(undefined)).toEqual({ topics: [], unknown: [] })
  })
})
