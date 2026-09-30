import { describe, expect, it } from "vitest"
import { companies, getCompany } from "../companies"

describe("companies", () => {
  it("has unique kebab-case slugs", () => {
    const slugs = companies.map((company) => company.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("returns the slug and display name for a company", () => {
    expect(getCompany("experience")).toEqual({ slug: "experience", name: "Experience LLC." })
  })

  it("throws for an unknown slug", () => {
    // @ts-expect-error - deliberately not a registered slug
    expect(() => getCompany("nope")).toThrow("Unknown company: nope")
  })
})
