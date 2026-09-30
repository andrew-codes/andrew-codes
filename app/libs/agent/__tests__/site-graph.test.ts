import { describe, expect, it, vi } from "vitest"
import type { MdxListItem } from "../../../types"
import { STATIC_PATHS, buildSiteGraph, createSiteGraphLoader, getPrerenderPaths } from "../site-graph.server"

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]> = {}, minutes = 2.4): MdxListItem => ({
  slug,
  frontmatter: { title: slug, description: `About ${slug}`, category: "engineering", ...frontmatter },
  readTime: { text: "", minutes, time: minutes * 60000, words: 0 },
})

describe("buildSiteGraph", () => {
  it("maps front matter onto typed posts", () => {
    const graph = buildSiteGraph([page("nix-post", { date: "2026-08-10", tags: ["nix", "featured", "agents"] })])

    expect(graph.posts).toEqual([
      {
        slug: "nix-post",
        path: "/posts/nix-post",
        title: "nix-post",
        description: "About nix-post",
        date: "2026-08-10",
        category: "engineering",
        tags: ["nix", "featured", "agents"],
        topics: ["nix", "ai"],
        featured: true,
        readingMinutes: 3,
      },
    ])
  })

  it("normalises Date front matter (as parsed from YAML) to a calendar date", () => {
    const date = new Date("2024-09-18") as unknown as string
    const [post] = buildSiteGraph([page("a", { date })]).posts

    expect(post.date).toBe("2024-09-18")
  })

  it("sorts newest first with slug as the tie-break and undated posts last", () => {
    const graph = buildSiteGraph([page("old", { date: "2020-01-01" }), page("b", { date: "2024-01-01" }), page("undated"), page("a", { date: "2024-01-01" })])

    expect(graph.posts.map((post) => post.slug)).toEqual(["a", "b", "old", "undated"])
  })

  it("keeps authored tags verbatim, distinct, in first-seen order", () => {
    const graph = buildSiteGraph([page("one", { tags: ["home assistant", "featured"] }), page("two", { tags: ["featured", "nix"] }), page("three")])

    expect(graph.tags).toEqual(["home assistant", "featured", "nix"])
  })

  it("reports tags outside the topic vocabulary without failing", () => {
    const graph = buildSiteGraph([page("one", { tags: ["nix", "brand-new-tag"] }), page("two", { tags: ["brand-new-tag"] })])

    expect(graph.unknownTags).toEqual(["brand-new-tag"])
    expect(graph.posts.find((post) => post.slug === "one")?.topics).toEqual(["nix"])
  })

  it("defaults missing front matter fields", () => {
    const [post] = buildSiteGraph([{ slug: "bare", frontmatter: { category: "engineering" } }]).posts

    expect(post).toMatchObject({ title: "bare", description: "", date: undefined, tags: [], topics: [], featured: false, readingMinutes: undefined })
  })

  it("exposes the public profile and topic vocabulary", () => {
    const graph = buildSiteGraph([])

    expect(graph.profile.location).toBe("Atlanta, GA")
    expect(graph.topics.length).toBeGreaterThan(0)
  })

  it("contains no email, phone, or mailto/tel values", () => {
    const serialized = JSON.stringify(buildSiteGraph([page("a", { date: "2026-01-01", tags: ["nix"] })]))

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
  })
})

describe("getPrerenderPaths", () => {
  it("lists the static pages, every post, and every authored tag", () => {
    const graph = buildSiteGraph([page("a", { date: "2024-01-01", tags: ["home assistant", "featured"] }), page("b", { date: "2023-01-01", tags: ["featured"] })])

    expect(getPrerenderPaths(graph)).toEqual([...STATIC_PATHS, "/posts/a", "/posts/b", "/tags/home assistant", "/tags/featured"])
  })

  it("includes the connect pages", () => {
    expect(getPrerenderPaths(buildSiteGraph([]))).toEqual(expect.arrayContaining(["/", "/posts", "/recommendations", "/connect", "/connect-with-me"]))
  })
})

describe("createSiteGraphLoader", () => {
  it("loads posts once and shares the graph between callers", async () => {
    const loadPages = vi.fn(async () => [page("a")])
    const getGraph = createSiteGraphLoader(loadPages)

    const [first, second] = await Promise.all([getGraph(), getGraph()])
    const third = await getGraph()

    expect(loadPages).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
    expect(third).toBe(first)
  })

  it("does not cache a failed load", async () => {
    const loadPages = vi.fn<() => Promise<MdxListItem[]>>().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce([page("a")])
    const getGraph = createSiteGraphLoader(loadPages)

    await expect(getGraph()).rejects.toThrow("boom")
    const graph = await getGraph()

    expect(loadPages).toHaveBeenCalledTimes(2)
    expect(graph.posts).toHaveLength(1)
  })
})
