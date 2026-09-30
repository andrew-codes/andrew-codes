import { describe, expect, it } from "vitest"
import { profile } from "../profile"
import { findCuratedTopic, resolveTopics, slugify, topicForTag, topics } from "../topics"

describe("curated topic list", () => {
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

  it("only lists expertise topics that exist", () => {
    for (const slug of profile.expertise) {
      expect(topics.map((topic) => topic.slug)).toContain(slug)
    }
  })
})

describe("topicForTag", () => {
  it("resolves a curated slug or alias, case and whitespace insensitively", () => {
    expect(topicForTag("home-assistant").slug).toBe("home-assistant")
    expect(topicForTag("home assistant").slug).toBe("home-assistant")
    expect(topicForTag("  Home   Assistant ").slug).toBe("home-assistant")
    expect(topicForTag("  Node.JS ").slug).toBe("nodejs")
  })

  it("merges spellings onto one curated topic", () => {
    expect(topicForTag("ai")).toBe(topicForTag("agents"))
    expect(topicForTag("estimation").slug).toBe("agile-estimation")
  })

  it("gives an unlisted tag its own topic, derived from the tag text", () => {
    expect(findCuratedTopic("underwater basket weaving")).toBeUndefined()
    expect(topicForTag("underwater basket weaving")).toEqual({ slug: "underwater-basket-weaving", label: "Underwater Basket Weaving", aliases: [] })
  })

  it("keeps the author's capitalisation in a derived label when there is any", () => {
    expect(topicForTag("OpenAI")).toMatchObject({ slug: "openai", label: "OpenAI" })
  })

  it("derives a stable kebab-case slug from punctuation and accents", () => {
    expect(topicForTag("C++ / Rust!").slug).toBe("c-rust")
    expect(topicForTag("Café Culture").slug).toBe("cafe-culture")
    expect(topicForTag("  Spaced   Out ").slug).toBe("spaced-out")
  })

  it("never throws or returns an empty slug, even for a tag with nothing sluggable in it", () => {
    for (const tag of ["+++", "!!!", "日本語", "   ", ""]) {
      expect(topicForTag(tag).slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
    expect(topicForTag("+++").slug).not.toBe(topicForTag("!!!").slug)
  })

  it("folds an unlisted tag whose derived slug is a curated slug into that topic", () => {
    expect(topicForTag("Voice-Assistant")).toBe(topicForTag("voice assistant"))
  })

  it("does not treat featured specially: it is validated out of tags before topics are read", () => {
    expect(topicForTag("featured").slug).toBe("featured")
  })
})

describe("slugify", () => {
  it("is idempotent on its own output", () => {
    for (const tag of ["Home Assistant", "node.js", "C++", "a  b", "Café"]) {
      expect(slugify(slugify(tag))).toBe(slugify(tag))
    }
  })
})

describe("resolveTopics", () => {
  it("dedupes topics that several tags map onto, keeping first-seen order", () => {
    const { topics: resolved, derivedFrom } = resolveTopics(["react", "agents", "ai", "graphql"])

    expect(resolved.map((topic) => topic.slug)).toEqual(["react", "ai", "graphql"])
    expect(derivedFrom).toEqual([])
  })

  it("gives unlisted tags a topic and reports them as authored", () => {
    const { topics: resolved, derivedFrom } = resolveTopics(["Mystery Tag", "nix", "mystery-tag"])

    expect(resolved.map((topic) => topic.slug)).toEqual(["mystery-tag", "nix"])
    expect(derivedFrom).toEqual(["Mystery Tag", "nix", "mystery-tag"])
  })

  it("handles missing tags", () => {
    expect(resolveTopics(undefined)).toEqual({ topics: [], derivedFrom: [] })
  })
})
