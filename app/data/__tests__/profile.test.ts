import { describe, expect, it } from "vitest"
import { getSocialLink, profile, socialLinks } from "../profile"

describe("profile", () => {
  it("exposes the approved public fields", () => {
    expect(profile.headline).toBe("Staff Software Engineer")
    expect(profile.bio).not.toHaveLength(0)
    expect(profile.image).toBe("/images/andrew-smith.webp")
    expect(profile.expertise.length).toBeGreaterThan(0)
  })

  it("keeps location to the city", () => {
    expect(profile.location).toBe("Atlanta, GA")
  })

  it("contains no email, phone number, or street address anywhere in the public data", () => {
    const serialized = JSON.stringify({ profile, socialLinks })

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
    expect(serialized).not.toMatch(/\+?\d[\d\s().-]{8,}\d/)
  })

  it("finds social links by id and throws for an unknown id", () => {
    expect(getSocialLink("github").url).toBe("https://github.com/andrew-codes")
    expect(() => getSocialLink("myspace")).toThrow("Unknown social link: myspace")
  })
})
