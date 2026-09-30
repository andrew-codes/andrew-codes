import { describe, expect, it, vi } from "vitest"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { CRAWLER_PATHS, RESOURCE_PATHS, STATIC_PATHS, SiteGraphError, buildSiteGraph, createSiteGraphLoader, getPrerenderPaths } from "../site-graph.server"

const sources = (items: MdxListItem[]): MdxPostSource[] => items.map((item) => ({ slug: item.slug, listItem: item }))
const broken = (slug: string, message = "bad front matter"): MdxPostSource => ({ slug, error: new Error(message) })

const page = (slug: string, frontmatter: Partial<MdxListItem["frontmatter"]> = {}, minutes = 2.4): MdxListItem => ({
  slug,
  frontmatter: { title: slug, description: `About ${slug}`, category: "engineering", ...frontmatter },
  readTime: { text: "", minutes, time: minutes * 60000, words: 0 },
})

describe("buildSiteGraph", () => {
  it("maps front matter onto typed posts", () => {
    const graph = buildSiteGraph(sources([page("nix-post", { date: "2026-08-10", featured: true, tags: ["nix", "agents"] })]))

    expect(graph.posts).toEqual([
      {
        slug: "nix-post",
        path: "/posts/nix-post",
        title: "nix-post",
        description: "About nix-post",
        date: "2026-08-10",
        category: "engineering",
        tags: ["nix", "agents"],
        topics: ["nix", "ai"],
        featured: true,
        companies: [],
        projects: [],
        technologies: [],
        readingMinutes: 3,
      },
    ])
  })

  it("normalises Date front matter (as parsed from YAML) to a calendar date", () => {
    const date = new Date("2024-09-18") as unknown as string
    const [post] = buildSiteGraph(sources([page("a", { date })])).posts

    expect(post.date).toBe("2024-09-18")
  })

  it("sorts newest first with slug as the tie-break and undated posts last", () => {
    const graph = buildSiteGraph(sources([page("old", { date: "2020-01-01" }), page("b", { date: "2024-01-01" }), page("undated"), page("a", { date: "2024-01-01" })]))

    expect(graph.posts.map((post) => post.slug)).toEqual(["a", "b", "old", "undated"])
  })

  it("keeps authored tags verbatim, distinct, in first-seen order", () => {
    const graph = buildSiteGraph(sources([page("one", { tags: ["home assistant", "ai"] }), page("two", { tags: ["ai", "nix"] }), page("three")]))

    expect(graph.tags).toEqual(["home assistant", "ai", "nix"])
  })

  it("gives a tag outside the curated topic list its own topic, without any problem", () => {
    const graph = buildSiteGraph(sources([page("one", { tags: ["nix", "Brand New Tag"] }), page("two", { tags: ["brand new tag"] })]))

    expect(graph.problems).toEqual([])
    expect(graph.derivedTags).toEqual(["nix", "Brand New Tag", "brand new tag"])
    expect(graph.posts.find((post) => post.slug === "one")?.topics).toEqual(["nix", "brand-new-tag"])
    expect(graph.topics).toEqual([
      { slug: "nix", label: "Nix", aliases: [] },
      { slug: "brand-new-tag", label: "Brand New Tag", aliases: [] },
    ])
  })

  it("lists each topic once, merging curated spellings", () => {
    const graph = buildSiteGraph(sources([page("one", { tags: ["ai", "home assistant"] }), page("two", { tags: ["agents"] })]))

    expect(graph.topics.map((topic) => topic.slug)).toEqual(["ai", "home-assistant"])
  })

  it("defaults missing front matter fields", () => {
    const [post] = buildSiteGraph(sources([{ slug: "bare", frontmatter: { category: "engineering" } }])).posts

    expect(post).toMatchObject({ title: "bare", description: "", date: undefined, tags: [], topics: [], featured: false, companies: [], projects: [], technologies: [], readingMinutes: undefined })
  })

  it("keeps a post whose front matter could not be read out of posts, but routable", () => {
    const graph = buildSiteGraph([...sources([page("good", { date: "2024-01-01", tags: ["nix"] })]), broken("broken-post", "bad indentation")])

    expect(graph.posts.map((post) => post.slug)).toEqual(["good"])
    expect(graph.invalidPosts).toEqual([{ slug: "broken-post", path: "/posts/broken-post", message: "bad indentation" }])
    expect(graph.tags).toEqual(["nix"])
  })

  it("exposes the public profile", () => {
    const graph = buildSiteGraph([])

    expect(graph.profile.location).toBe("Atlanta, GA")
    expect(graph.topics).toEqual([])
  })

  it("contains no email, phone, or mailto/tel values", () => {
    const serialized = JSON.stringify(buildSiteGraph(sources([page("a", { date: "2026-01-01", tags: ["nix"] })])))

    expect(serialized).not.toMatch(/[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i)
    expect(serialized).not.toMatch(/mailto:|tel:/i)
  })
})

describe("getPrerenderPaths", () => {
  it("lists the static pages, every post, and one page per topic", () => {
    const graph = buildSiteGraph(sources([page("a", { date: "2024-01-01", tags: ["home assistant", "agents"] }), page("b", { date: "2023-01-01", tags: ["ai", "Something New"] })]))

    expect(getPrerenderPaths(graph)).toEqual([
      ...STATIC_PATHS,
      ...RESOURCE_PATHS,
      "/posts/a",
      "/posts/b",
      "/tags/home-assistant",
      "/tags/ai",
      "/tags/something-new",
      "/posts/a.md",
      "/posts/b.md",
      "/tags/home-assistant.md",
      "/tags/ai.md",
      "/tags/something-new.md",
      ...CRAWLER_PATHS,
    ])
  })

  it("still lists a post whose front matter could not be read, so only its own prerender fails", () => {
    const graph = buildSiteGraph([...sources([page("good", { tags: ["nix"] })]), broken("broken-post")])

    expect(getPrerenderPaths(graph)).toEqual([...STATIC_PATHS, ...RESOURCE_PATHS, "/posts/good", "/posts/broken-post", "/tags/nix", "/posts/good.md", "/tags/nix.md", ...CRAWLER_PATHS])
  })

  it("includes the agent JSON indexes", () => {
    expect(getPrerenderPaths(buildSiteGraph([]))).toEqual(expect.arrayContaining(["/agent/posts.json", "/agent/projects.json"]))
  })

  it("includes the crawler files", () => {
    expect(getPrerenderPaths(buildSiteGraph([]))).toEqual(expect.arrayContaining(["/robots.txt", "/sitemap.xml", "/feed.xml"]))
  })

  it("includes the markdown twins and llms.txt files", () => {
    expect(getPrerenderPaths(buildSiteGraph([]))).toEqual(
      expect.arrayContaining(["/index.md", "/posts.md", "/recommendations.md", "/resume.md", "/llms.txt", "/llms-full.txt"]),
    )
  })

  it("includes the connect pages", () => {
    expect(getPrerenderPaths(buildSiteGraph([]))).toEqual(expect.arrayContaining(["/", "/posts", "/recommendations", "/connect", "/connect-with-me"]))
  })
})

describe("projects and companies", () => {
  const defn = { slug: "forecaster", name: "Forecaster", role: "creator", repo: "https://github.com/o/forecaster" }
  const graph = buildSiteGraph(
    sources([
      page("new", { date: "2026-01-01", tags: ["ai"], projects: ["forecaster", "jest"], companies: ["microsoft"] }),
      page("old", { date: "2024-01-01", tags: ["forecasting"], projects: [defn, { slug: "jest", name: "Jest", role: "user", url: "https://jestjs.io" }] }),
    ]),
  )

  it("aggregates projects across posts and splits out technologies I use", () => {
    expect(graph.problems).toEqual([])
    expect(graph.projects.map((project) => project.slug)).toEqual(["forecaster"])
    expect(graph.technologies.map((project) => project.slug)).toEqual(["jest"])
    expect(graph.projects[0]).toMatchObject({ name: "Forecaster", firstWritten: "2024-01-01", lastWritten: "2026-01-01", topics: ["ai", "forecasting"] })
  })

  it("puts each post's projects and technologies on the post, by role", () => {
    const post = graph.posts.find((candidate) => candidate.slug === "new")

    expect(post).toMatchObject({ projects: ["forecaster"], technologies: ["jest"], companies: ["microsoft"] })
  })

  it("builds the company registry from the resume company slugs", () => {
    expect(graph.companies.map((company) => company.slug)).toEqual(expect.arrayContaining(["microsoft"]))
  })

  it("collects every authoring problem instead of stopping at the first", () => {
    const bad = buildSiteGraph(sources([page("a", { tags: ["featured"], companies: ["initech"] }), page("b", { projects: ["ghost"] })]))

    expect(bad.problems).toHaveLength(3)
  })
})

describe("createSiteGraphLoader", () => {
  it("rejects with every problem listed when front matter is invalid, and does not cache the failure", async () => {
    const loadSources = vi.fn(async () => sources([page("a", { tags: ["featured"] }), page("b", { companies: ["initech"] })]))
    const getGraph = createSiteGraphLoader(loadSources)

    const error = await getGraph().catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(SiteGraphError)
    expect((error as SiteGraphError).problems).toHaveLength(2)
    expect((error as SiteGraphError).message).toContain("post `a`")
    expect((error as SiteGraphError).message).toContain("post `b`")

    await getGraph().catch(() => undefined)
    expect(loadSources).toHaveBeenCalledTimes(2)
  })

  it("does not fail the build over a tag that is not in the curated topic list", async () => {
    const graph = await createSiteGraphLoader(async () => sources([page("a", { tags: ["never-heard-of-it"] })]))()

    expect(graph.topics.map((topic) => topic.slug)).toEqual(["never-heard-of-it"])
  })

  it("loads posts once and shares the graph between callers", async () => {
    const loadSources = vi.fn(async () => sources([page("a")]))
    const getGraph = createSiteGraphLoader(loadSources)

    const [first, second] = await Promise.all([getGraph(), getGraph()])
    const third = await getGraph()

    expect(loadSources).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
    expect(third).toBe(first)
  })

  it("does not cache a failed load", async () => {
    const loadSources = vi.fn<() => Promise<MdxPostSource[]>>().mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce(sources([page("a")]))
    const getGraph = createSiteGraphLoader(loadSources)

    await expect(getGraph()).rejects.toThrow("boom")
    const graph = await getGraph()

    expect(loadSources).toHaveBeenCalledTimes(2)
    expect(graph.posts).toHaveLength(1)
  })
})
