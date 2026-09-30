import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { companies } from "../companies"
import { featuredRecommendations, otherRecommendations, recommendations } from "../recommendations"

describe("recommendations", () => {
  it("keeps the featured recommendations first, in their authored order", () => {
    expect(featuredRecommendations.map((r) => r.author.name)).toEqual(["Denise Architetto", "Rick Cabrera", "Darnell Brown"])
    expect(recommendations.slice(0, featuredRecommendations.length)).toEqual(featuredRecommendations)
    expect(otherRecommendations).toHaveLength(7)
    expect(recommendations).toHaveLength(10)
  })

  it("has unique kebab-case ids", () => {
    const ids = recommendations.map((r) => r.id)

    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("joins every author to a registered company", () => {
    for (const { author } of recommendations) {
      expect(companies).toContainEqual(author.company)
    }
  })

  it("has a photo on disk, a title, and at least one non-empty paragraph for every recommendation", () => {
    for (const { author, paragraphs } of recommendations) {
      expect(existsSync(join(__dirname, "../../public", author.image))).toBe(true)
      expect(author.title.trim()).not.toHaveLength(0)
      expect(paragraphs.length).toBeGreaterThan(0)
      for (const paragraph of paragraphs) expect(paragraph).toBe(paragraph.trim())
      for (const paragraph of paragraphs) expect(paragraph).not.toHaveLength(0)
    }
  })

  it("exposes only the approved public fields", () => {
    for (const recommendation of recommendations) {
      expect(Object.keys(recommendation).sort()).toEqual(["author", "featured", "id", "paragraphs"])
      expect(Object.keys(recommendation.author).sort()).toEqual(["company", "image", "name", "title"])
    }
  })

  it("contains no email, phone number, or mailto/tel values", () => {
    const serialized = JSON.stringify(recommendations)

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
    expect(serialized).not.toMatch(/\+?\d[\d\s().-]{8,}\d/)
  })
})
