import { describe, expect, it } from "vitest"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildPostsDocument, buildProjectsDocument } from "../catalog"
import { buildSiteGraph } from "../site-graph.server"

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]>): MdxPostSource => ({
  slug,
  listItem: { slug, frontmatter: { title: `Post ${slug}`, description: `About ${slug}`, category: "engineering", ...frontmatter }, readTime: { text: "", minutes: 4.2, time: 0, words: 0 } },
})

const graph = buildSiteGraph([
  page("nix-old", {
    date: "2024-03-01",
    tags: ["nix", "Brand New"],
    projects: [
      { slug: "devtools", name: "devtools", role: "creator", repo: "https://github.com/o/devtools", summary: "My setup" },
      { slug: "nix", name: "Nix", role: "user", url: "https://nixos.org" },
    ],
  }),
  page("nix-new", { date: "2026-08-10", category: "agility", featured: true, tags: ["nix", "agents"], companies: ["microsoft"], projects: ["devtools", "nix"] }),
  page("plain", { date: "2025-01-01", tags: ["ai"] }),
])

describe("buildPostsDocument", () => {
  const document = buildPostsDocument(graph)

  it("describes each post with absolute urls, newest first, and no body", () => {
    expect(document.posts.map((post) => post.slug)).toEqual(["nix-new", "plain", "nix-old"])
    expect(document.posts[0]).toEqual({
      slug: "nix-new",
      url: "https://andrew.codes/posts/nix-new",
      title: "Post nix-new",
      description: "About nix-new",
      date: "2026-08-10",
      category: "agility",
      tags: ["nix", "agents"],
      topics: ["nix", "ai"],
      projects: ["devtools"],
      technologies: ["nix"],
      companies: ["microsoft"],
      readingMinutes: 5,
      featured: true,
    })
  })

  it("lists the topics in use with their labels, derived ones included", () => {
    expect(document.topics).toEqual([
      { slug: "ai", label: "AI" },
      { slug: "brand-new", label: "Brand New" },
      { slug: "nix", label: "Nix" },
    ])
  })

  it("builds inverted facets: value to post slugs, newest first, keys sorted", () => {
    expect(document.facets).toEqual({
      category: { agility: ["nix-new"], engineering: ["plain", "nix-old"] },
      tag: { "Brand New": ["nix-old"], agents: ["nix-new"], ai: ["plain"], nix: ["nix-new", "nix-old"] },
      topic: { ai: ["nix-new", "plain"], "brand-new": ["nix-old"], nix: ["nix-new", "nix-old"] },
      project: { devtools: ["nix-new", "nix-old"] },
      technology: { nix: ["nix-new", "nix-old"] },
      company: { microsoft: ["nix-new"] },
    })
  })

  it("uses null, not a missing key, for an absent date or reading time", () => {
    const [post] = buildPostsDocument(buildSiteGraph([{ slug: "bare", listItem: { slug: "bare", frontmatter: { category: "engineering" } } }])).posts

    expect(post).toMatchObject({ date: null, readingMinutes: null, tags: [], projects: [], technologies: [], companies: [], featured: false })
  })
})

describe("buildProjectsDocument", () => {
  const document = buildProjectsDocument(graph)

  it("lists things I built apart from technologies I use", () => {
    expect(document.projects.map((project) => project.slug)).toEqual(["devtools"])
    expect(document.technologiesIUse.map((project) => project.slug)).toEqual(["nix"])
  })

  it("aggregates a project across the posts that mention it", () => {
    expect(document.projects[0]).toEqual({
      slug: "devtools",
      name: "devtools",
      role: "creator",
      summary: "My setup",
      repo: "https://github.com/o/devtools",
      firstWritten: "2024-03-01",
      lastWritten: "2026-08-10",
      topics: ["nix", "ai", "brand-new"],
      posts: [
        { slug: "nix-new", title: "Post nix-new", date: "2026-08-10", url: "https://andrew.codes/posts/nix-new" },
        { slug: "nix-old", title: "Post nix-old", date: "2024-03-01", url: "https://andrew.codes/posts/nix-old" },
      ],
    })
  })

  it("leaves out fields the posts never gave, rather than inventing them", () => {
    expect(document.technologiesIUse[0]).not.toHaveProperty("repo")
    expect(document.technologiesIUse[0]).not.toHaveProperty("company")
    expect(document.technologiesIUse[0]).not.toHaveProperty("status")
  })

  it("has role, company and topic facets over both lists", () => {
    expect(document.facets.role).toEqual({ creator: ["devtools"], user: ["nix"] })
    expect(document.facets.company).toEqual({})
    expect(document.facets.topic.nix).toEqual(["devtools", "nix"])
  })
})
