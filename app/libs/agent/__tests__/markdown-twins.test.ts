import { describe, expect, it } from "vitest"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { renderHomeMarkdown, renderPostMarkdown, renderPostsIndexMarkdown, renderRecommendationsMarkdown, renderTagMarkdown } from "../markdown-twins"
import { getCompany } from "../../../data/companies"
import type { Recommendation } from "../../../data/recommendations"
import { buildSiteGraph } from "../site-graph.server"

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]> = {}, minutes = 2.4): MdxPostSource => ({
  slug,
  listItem: {
    slug,
    frontmatter: { title: `Title of ${slug}`, description: `About ${slug}`, category: "engineering", ...frontmatter },
    readTime: { text: "", minutes, time: minutes * 60000, words: 0 },
  },
})

const graph = buildSiteGraph([
  page("old", { date: "2023-02-03", tags: ["home assistant"] }),
  page("new", { date: "2024-09-18", tags: ["home assistant", "nix", "featured"] }),
  page("undated", { description: "" }),
])
const post = (slug: string) => graph.posts.find((candidate) => candidate.slug === slug)!

describe("renderPostMarkdown", () => {
  const markdown = renderPostMarkdown(graph, post("new"), "Body paragraph.\n\n## A section")

  it("opens with the title, description and source page", () => {
    expect(markdown.startsWith("# Title of new\n\n> About new\n\n- Source: https://andrew.codes/posts/new/\n")).toBe(true)
  })

  it("lists the metadata an agent needs to cite the post", () => {
    expect(markdown).toContain("- Author: Andrew Smith (https://andrew.codes)")
    expect(markdown).toContain("- Published: 2024-09-18")
    expect(markdown).toContain("- Category: engineering")
    expect(markdown).toContain("- Reading time: 3 min")
  })

  it("leaves the featured flag out of the tags", () => {
    expect(markdown).toContain("- Tags: home assistant, nix\n")
  })

  it("follows the metadata with the body", () => {
    expect(markdown.endsWith("\n\nBody paragraph.\n\n## A section\n")).toBe(true)
  })

  it("omits what a post does not have instead of inventing it", () => {
    const bare = renderPostMarkdown(graph, post("undated"), "Body.")

    expect(bare).not.toContain("> ")
    expect(bare).not.toContain("Published:")
    expect(bare).not.toContain("Tags:")
  })
})

describe("renderPostsIndexMarkdown", () => {
  it("links every post's twin, newest first, with date and description", () => {
    const markdown = renderPostsIndexMarkdown(graph)

    expect(markdown).toContain("Source: https://andrew.codes/posts/")
    expect(markdown.indexOf("posts/new.md")).toBeLessThan(markdown.indexOf("posts/old.md"))
    expect(markdown).toContain("- [Title of new](https://andrew.codes/posts/new.md): 2024-09-18 - About new")
    expect(markdown).toContain("- [Title of undated](https://andrew.codes/posts/undated.md)\n")
  })
})

describe("renderTagMarkdown", () => {
  const markdown = renderTagMarkdown(graph, "home assistant")

  it("lists only posts with the tag, and names the encoded source page", () => {
    expect(markdown).toContain("# Posts tagged \"home assistant\"")
    expect(markdown).toContain("Source: https://andrew.codes/tags/home%20assistant/")
    expect(markdown).toContain("posts/old.md")
    expect(markdown).toContain("posts/new.md")
    expect(markdown).not.toContain("posts/undated.md")
  })
})

describe("renderRecommendationsMarkdown", () => {
  const recommendations: Recommendation[] = [
    {
      id: "ada-lovelace",
      author: { name: "Ada Lovelace", title: "Principal Engineer", company: getCompany("microsoft"), image: "/images/ada.jpeg" },
      featured: true,
      paragraphs: ["First paragraph.", "Second paragraph."],
    },
  ]
  const markdown = renderRecommendationsMarkdown(graph, recommendations)

  it("gives each recommender name, photo, title and employer", () => {
    expect(markdown).toContain("## Ada Lovelace")
    expect(markdown).toContain("![Ada Lovelace](https://andrew.codes/images/ada.jpeg)")
    expect(markdown).toContain("Principal Engineer, Microsoft")
  })

  it("quotes every paragraph as one blockquote", () => {
    expect(markdown).toContain("> First paragraph.\n>\n> Second paragraph.")
  })
})

describe("renderHomeMarkdown", () => {
  const markdown = renderHomeMarkdown(graph)

  it("introduces the person with headline, city, bio and profiles", () => {
    expect(markdown).toContain("# Andrew Smith")
    expect(markdown).toContain("Staff Software Engineer, Atlanta, GA")
    expect(markdown).toContain("[GitHub](https://github.com/andrew-codes)")
  })

  it("links the other twins and the newest posts", () => {
    expect(markdown).toContain("[Resume](https://andrew.codes/resume.md)")
    expect(markdown).toContain("[All posts](https://andrew.codes/posts.md)")
    expect(markdown).toContain("posts/new.md")
  })
})
