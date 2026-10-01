import fs from "fs/promises"
import os from "os"
import path from "path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { getMdxListItems, getMdxPostSources } from "../mdx.server"

let postsDir: string

const writePost = async (slug: string, contents: string) => {
  const dir = path.join(postsDir, "2026", slug)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, `${slug}.mdx`), contents)
}

beforeEach(async () => {
  postsDir = await fs.mkdtemp(path.join(os.tmpdir(), "mdx-server-"))
})

afterEach(async () => {
  await fs.rm(postsDir, { recursive: true, force: true })
})

describe("getMdxListItems", () => {
  it("reads slug, front matter and reading time from each post", async () => {
    await writePost("first", "---\ntitle: First\ndate: 2026-08-10\ncategory: engineering\ntags:\n  - nix\n  - featured\n---\n\nSome words in the body.\n")

    const [item] = await getMdxListItems({}, postsDir)

    expect(item.slug).toBe("first")
    expect(item.frontmatter).toMatchObject({ title: "First", category: "engineering", tags: ["nix", "featured"] })
    // YAML parses an unquoted date into a Date, exactly as the compiled page does.
    expect(item.frontmatter.date).toEqual(new Date("2026-08-10"))
    expect(item.readTime?.words).toBeGreaterThan(0)
  })

  it("defaults a missing category", async () => {
    await writePost("plain", "---\ntitle: Plain\n---\n\nBody\n")

    const [item] = await getMdxListItems({}, postsDir)

    expect(item.frontmatter.category).toBe("not categorized")
  })

  it("does not compile MDX, so an uncompilable body does not matter", async () => {
    await writePost("uncompilable", '---\ntitle: Uncompilable\ncategory: engineering\n---\n\nimport Missing from "./does-not-exist"\n\n<Missing>unclosed\n')

    const items = await getMdxListItems({}, postsDir)

    expect(items.map((item) => item.slug)).toEqual(["uncompilable"])
  })

  it("rejects when a post's front matter is malformed", async () => {
    await writePost("broken", "---\ntitle: [unclosed\n---\n\nBody\n")

    await expect(getMdxListItems({}, postsDir)).rejects.toThrow()
  })
})

describe("getMdxPostSources", () => {
  it("lists a post with unreadable front matter by slug, alongside the readable ones", async () => {
    await writePost("good", "---\ntitle: Good\ncategory: engineering\n---\n\nBody\n")
    await writePost("broken", "---\ntitle: [unclosed\n---\n\nBody\n")

    const sources = await getMdxPostSources(postsDir)
    const bySlug = Object.fromEntries(sources.map((source) => [source.slug, source]))

    expect(Object.keys(bySlug).sort()).toEqual(["broken", "good"])
    expect(bySlug.good.listItem?.frontmatter.title).toBe("Good")
    expect(bySlug.broken.listItem).toBeUndefined()
    expect("error" in bySlug.broken && bySlug.broken.error).toBeInstanceOf(Error)
  })
})
