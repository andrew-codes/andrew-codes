import { describe, expect, it } from "vitest"
import type { MdxPage } from "../../../types"
import postsByCategory from "../categorize"

const post = (category: MdxPage["frontmatter"]["category"], title: string): MdxPage =>
  ({
    code: "",
    slug: title,
    frontmatter: { title, category },
  }) as MdxPage

describe("postsByCategory", () => {
  it("groups posts under every known category, in category order", () => {
    const posts = [post("engineering", "A"), post("agility", "B"), post("engineering", "C")]

    const grouped = postsByCategory(posts)

    expect(grouped.map(([category]) => category)).toEqual(["engineering", "agility", "presentation", "home automation"])

    const engineering = grouped.find(([category]) => category === "engineering")![1]
    expect(engineering.map((p) => p.slug)).toEqual(["A", "C"])
  })

  it("returns an empty list for a category with no matching posts", () => {
    const posts = [post("engineering", "A")]

    const grouped = postsByCategory(posts)

    const presentation = grouped.find(([category]) => category === "presentation")![1]
    expect(presentation).toEqual([])
  })
})
