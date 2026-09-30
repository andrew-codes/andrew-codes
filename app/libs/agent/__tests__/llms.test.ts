import { describe, expect, it } from "vitest"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildLlmsFullTxt, buildLlmsTxt } from "../llms"
import { buildSiteGraph } from "../site-graph.server"

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]> = {}): MdxPostSource => ({
  slug,
  listItem: { slug, frontmatter: { title: `Title of ${slug}`, description: `About ${slug}`, category: "engineering", ...frontmatter } },
})

const graph = buildSiteGraph([page("old", { date: "2023-02-03", tags: ["home assistant"] }), page("new", { date: "2024-09-18", tags: ["nix", "featured"] })])

describe("buildLlmsTxt", () => {
  const llms = buildLlmsTxt(graph)

  it("follows the llms.txt shape: H1, blockquote summary, then H2 link lists", () => {
    expect(llms.startsWith("# Andrew Smith\n\n> Staff Software Engineer in Atlanta, GA.")).toBe(true)
    expect(llms).toMatch(/^## About$/m)
    expect(llms).toMatch(/^## Posts$/m)
    expect(llms).toMatch(/^## Optional$/m)
  })

  it("links every post to its markdown twin, newest first", () => {
    expect(llms).toContain("- [Title of new](https://andrew.codes/posts/new.md): 2024-09-18 - About new")
    expect(llms.indexOf("posts/new.md")).toBeLessThan(llms.indexOf("posts/old.md"))
  })

  it("links the resume and recommendations twins", () => {
    expect(llms).toContain("(https://andrew.codes/resume.md)")
    expect(llms).toContain("(https://andrew.codes/recommendations.md)")
  })

  it("links tag twins with spaces encoded, and leaves out the featured flag", () => {
    expect(llms).toContain("- [home assistant](https://andrew.codes/tags/home%20assistant.md)")
    expect(llms).not.toContain("/tags/featured.md")
  })

  it("points at the full-content file, feed, sitemap and profiles already linked on the site", () => {
    expect(llms).toContain("(https://andrew.codes/llms-full.txt)")
    expect(llms).toContain("(https://andrew.codes/feed.xml)")
    expect(llms).toContain("(https://andrew.codes/sitemap.xml)")
    expect(llms).toContain("(https://github.com/andrew-codes)")
  })

  it("is deterministic", () => {
    expect(buildLlmsTxt(graph)).toBe(llms)
  })
})

describe("buildLlmsFullTxt", () => {
  const full = buildLlmsFullTxt(graph, [{ markdown: "# Resume\n\nJobs.\n" }, { markdown: "# A post\n\nBody.\n" }])

  it("opens with an intro that points back at llms.txt", () => {
    expect(full.startsWith("# Andrew Smith - full site content\n")).toBe(true)
    expect(full).toContain("https://andrew.codes/llms.txt")
  })

  it("includes every document, separated by horizontal rules", () => {
    expect(full).toContain("\n\n---\n\n# Resume\n\nJobs.\n\n---\n\n# A post\n\nBody.\n")
  })
})
