import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { getBackgroundGradient, getCategories, getColors, getDescription } from "../categories"

describe("getCategories", () => {
  it("returns every known category", () => {
    expect(getCategories()).toEqual(["engineering", "agility", "presentation", "home automation"])
  })
})

describe("getBackgroundGradient", () => {
  it("returns a gradient for a known category", () => {
    expect(getBackgroundGradient("engineering")).toMatch(/^linear-gradient/)
  })

  it("returns white for an undefined or null category", () => {
    expect(getBackgroundGradient(undefined)).toBe("rgb(255,255,255)")
    expect(getBackgroundGradient(null)).toBe("rgb(255,255,255)")
  })

  it("returns white for the not-categorized category", () => {
    expect(getBackgroundGradient("not categorized")).toBe("rgb(255,255,255)")
  })
})

describe("getColors", () => {
  it("returns the color pair for a known category", () => {
    expect(getColors("presentation")).toEqual(["rgba(49, 163, 86)", "rgba(58, 178, 123)"])
  })

  it("returns an empty array for an undefined or null category", () => {
    expect(getColors(undefined)).toEqual([])
    expect(getColors(null)).toEqual([])
  })
})

describe("getDescription", () => {
  it("returns a description for a known category", () => {
    const html = renderToStaticMarkup(<>{getDescription("agility")}</>)

    expect(html).toContain("agility")
  })

  it("returns an empty string for an undefined or null category", () => {
    expect(getDescription(undefined)).toBe("")
    expect(getDescription(null)).toBe("")
  })
})
