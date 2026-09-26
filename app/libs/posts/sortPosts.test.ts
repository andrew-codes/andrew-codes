import { describe, expect, it } from "vitest"
import type { MdxPage } from "../../types"
import { alphabetically, newestFirst, order } from "./sortPosts"

const post = (title: string, date?: string): MdxPage =>
  ({
    code: "",
    slug: title,
    frontmatter: { title, date, category: "engineering" },
  }) as MdxPage

describe("alphabetically", () => {
  it("sorts posts by title ascending", () => {
    const posts = [post("Zebra"), post("Apple"), post("Mango")]

    expect(posts.sort(alphabetically).map((p) => p.frontmatter.title)).toEqual(["Apple", "Mango", "Zebra"])
  })

  it("treats a missing title as an empty string", () => {
    const posts = [post("Apple"), post(undefined as unknown as string)]

    expect(() => posts.sort(alphabetically)).not.toThrow()
  })
})

describe("newestFirst", () => {
  it("sorts posts by date descending", () => {
    const posts = [post("Old", "2020-01-01"), post("New", "2024-01-01"), post("Middle", "2022-01-01")]

    expect(posts.sort(newestFirst).map((p) => p.frontmatter.title)).toEqual(["New", "Middle", "Old"])
  })

  it("treats a missing date as the epoch", () => {
    const posts = [post("Dated", "2024-01-01"), post("Undated")]

    expect(posts.sort(newestFirst).map((p) => p.frontmatter.title)).toEqual(["Dated", "Undated"])
  })
})

describe("order", () => {
  it("sorts newest-first, breaking ties alphabetically by title", () => {
    const posts = [post("Beta", "2024-01-01"), post("Alpha", "2024-01-01"), post("Oldest", "2020-01-01")]

    expect(order(posts).map((p) => p.frontmatter.title)).toEqual(["Alpha", "Beta", "Oldest"])
  })
})
