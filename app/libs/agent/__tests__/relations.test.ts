import { describe, expect, it } from "vitest"
import type { MdxListItem } from "../../../types"
import { aggregateProjects, parsePostRelations, type Company } from "../relations"

const companies: Company[] = [
  { slug: "microsoft", name: "Microsoft" },
  { slug: "experience", name: "Experience" },
]

const fm = (extra: Record<string, unknown>): MdxListItem["frontmatter"] => ({ title: "t", category: "engineering", ...extra }) as MdxListItem["frontmatter"]
const parse = (extra: Record<string, unknown>) => parsePostRelations("my-post", fm(extra), companies)

const defn = { slug: "playnite-web", name: "Playnite Web", role: "creator" }

describe("parsePostRelations", () => {
  it("defaults every optional field", () => {
    expect(parse({})).toEqual({ relations: { featured: false, companies: [], projects: [] }, problems: [] })
  })

  it("reads featured, companies and both project forms", () => {
    const { relations, problems } = parse({ featured: true, companies: ["microsoft", "microsoft", "experience"], projects: [{ ...defn, url: "https://example.com/pw", company: "microsoft" }, "other-project"] })

    expect(problems).toEqual([])
    expect(relations.featured).toBe(true)
    expect(relations.companies).toEqual(["microsoft", "experience"])
    expect(relations.projects).toEqual([{ slug: "playnite-web", definition: { ...defn, url: "https://example.com/pw", company: "microsoft" } }, { slug: "other-project" }])
  })

  describe("tags and topics", () => {
    it("never treats a tag outside the curated topic list as a problem", () => {
      expect(parse({ tags: ["nix", "brand-new tag", "Anything Goes!"] }).problems).toEqual([])
    })

    it("rejects the retired featured tag with instructions", () => {
      const { problems } = parse({ tags: ["nix", "Featured"] })

      expect(problems).toEqual(["post `my-post`: `featured` is a front matter field now, not a tag - remove it from `tags` and add `featured: true`"])
    })

    it("rejects tags that are not a list of non-empty strings", () => {
      expect(parse({ tags: "nix" }).problems).toHaveLength(1)
      expect(parse({ tags: ["nix", ""] }).problems).toHaveLength(1)
      expect(parse({ tags: [1] }).problems).toHaveLength(1)
    })
  })

  describe("validation", () => {
    it("rejects a non-boolean featured", () => {
      expect(parse({ featured: "yes" }).problems).toEqual(["post `my-post`: `featured` must be true or false, got \"yes\""])
    })

    it("rejects an unknown company, naming the known ones", () => {
      const { problems } = parse({ companies: ["microsoft", "initech"] })

      expect(problems).toEqual(["post `my-post`: unknown company \"initech\" (known companies: `microsoft`, `experience`)"])
    })

    it("rejects companies that are not a list", () => {
      expect(parse({ companies: "microsoft" }).problems).toEqual(["post `my-post`: `companies` must be a list of company slugs"])
    })

    it("rejects projects that are not a list, or entries that are neither slug nor object", () => {
      expect(parse({ projects: "x" }).problems).toEqual(["post `my-post`: `projects` must be a list"])
      expect(parse({ projects: [42] }).problems).toEqual(["post `my-post`: each project must be a slug or an object with slug, name and role"])
    })

    it("requires kebab-case slugs, for both forms", () => {
      expect(parse({ projects: ["Playnite Web"] }).problems).toEqual(["post `my-post`: project reference `Playnite Web` must be a kebab-case slug"])
      expect(parse({ projects: [{ ...defn, slug: "Playnite_Web" }] }).problems[0]).toContain("kebab-case")
      expect(parse({ projects: [{ name: "x", role: "creator" }] }).problems[0]).toContain("kebab-case")
    })

    it("requires name and a valid role on a definition", () => {
      expect(parse({ projects: [{ slug: "a", role: "creator" }] }).problems).toEqual(["post `my-post`: project `a` needs a `name` (or, to refer to a project defined in another post, use the bare slug)"])
      expect(parse({ projects: [{ slug: "a", name: "A", role: "owner" }] }).problems[0]).toContain("`role` must be one of `creator`, `maintainer`, `contributor`, `user`")
      expect(parse({ projects: [{ slug: "a", name: "A" }] }).problems[0]).toContain("`role` must be one of")
    })

    it("validates status, urls and company", () => {
      expect(parse({ projects: [{ ...defn, status: "dead" }] }).problems[0]).toContain("`status` must be one of `active`, `archived`, `experimental`")
      expect(parse({ projects: [{ ...defn, url: "not a url" }] }).problems[0]).toContain("`url` must be an http(s) URL")
      expect(parse({ projects: [{ ...defn, repo: "git@github.com:a/b.git" }] }).problems[0]).toContain("`repo` must be an http(s) URL")
      expect(parse({ projects: [{ ...defn, url: "https://user:pw@example.com" }] }).problems[0]).toContain("`url`")
      expect(parse({ projects: [{ ...defn, company: "initech" }] }).problems[0]).toContain("`company` must be one of `microsoft`, `experience`")
    })

    it("rejects unknown project fields, so a typo cannot silently drop data", () => {
      expect(parse({ projects: [{ ...defn, github: "https://github.com/a/b" }] }).problems).toEqual(["post `my-post`: project `playnite-web` has an unknown field `github` (allowed: `slug`, `name`, `role`, `url`, `repo`, `summary`, `status`, `company`)"])
    })

    it("rejects a project listed twice in one post", () => {
      expect(parse({ projects: [defn, "playnite-web"] }).problems).toEqual(["post `my-post`: project `playnite-web` is listed twice"])
    })

    it("reports every problem in a post, not just the first", () => {
      expect(parse({ featured: 1, companies: ["x"], projects: [{ slug: "a" }] }).problems.length).toBeGreaterThanOrEqual(3)
    })
  })
})

type Input = Parameters<typeof aggregateProjects>[0][number]
const post = (slug: string, date: string | undefined, projects: Input["projects"], topics: string[] = []): Input => ({ slug, title: `Post ${slug}`, path: `/posts/${slug}`, date, topics, projects })
const definition = (slug: string, extra: Record<string, unknown> = {}) => ({ slug, definition: { slug, name: slug.toUpperCase(), role: "creator" as const, ...extra } })

describe("aggregateProjects", () => {
  it("joins a definition and later bare references across posts", () => {
    const { projects, problems } = aggregateProjects([
      post("new", "2026-08-01", [{ slug: "a" }], ["ai", "nix"]),
      post("old", "2024-01-05", [definition("a", { url: "https://a.example", summary: "A tool" })], ["nix", "python"]),
    ])

    expect(problems).toEqual([])
    expect(projects).toEqual([
      {
        slug: "a",
        name: "A",
        role: "creator",
        url: "https://a.example",
        summary: "A tool",
        firstWritten: "2024-01-05",
        lastWritten: "2026-08-01",
        // Newest first, as the graph passes them.
        posts: [
          { slug: "new", title: "Post new", path: "/posts/new", date: "2026-08-01" },
          { slug: "old", title: "Post old", path: "/posts/old", date: "2024-01-05" },
        ],
        topics: ["ai", "nix", "python"],
      },
    ])
  })

  it("merges fields that different posts each contribute", () => {
    const { projects, problems } = aggregateProjects([post("a", "2024-01-01", [definition("x", { url: "https://x.example" })]), post("b", "2025-01-01", [definition("x", { repo: "https://github.com/o/x", status: "active" })])])

    expect(problems).toEqual([])
    expect(projects[0]).toMatchObject({ url: "https://x.example", repo: "https://github.com/o/x", status: "active" })
  })

  it("accepts a definition repeated identically", () => {
    expect(aggregateProjects([post("a", "2024-01-01", [definition("x")]), post("b", "2025-01-01", [definition("x")])]).problems).toEqual([])
  })

  it("reports a conflicting field, naming both posts, instead of picking a winner", () => {
    const { problems } = aggregateProjects([post("a", "2024-01-01", [definition("x", { url: "https://one.example" })]), post("b", "2025-01-01", [definition("x", { url: "https://two.example" })])])

    expect(problems).toEqual(["project `x`: `url` is \"https://one.example\" in post `a` but \"https://two.example\" in post `b`"])
  })

  it("reports a conflicting role or name", () => {
    const { problems } = aggregateProjects([post("a", "2024-01-01", [definition("x")]), post("b", "2025-01-01", [definition("x", { role: "user", name: "Ex" })])])

    expect(problems).toHaveLength(2)
    expect(problems.join("\n")).toContain("`role`")
    expect(problems.join("\n")).toContain("`name`")
  })

  it("reports a bare reference that no post defines", () => {
    const { projects, problems } = aggregateProjects([post("a", "2024-01-01", [{ slug: "ghost" }])])

    expect(projects).toEqual([])
    expect(problems).toEqual(["post `a`: project `ghost` is not defined in any post (define it with slug, name and role in one post, or fix the slug)"])
  })

  it("leaves written dates out when no mentioning post is dated", () => {
    const [project] = aggregateProjects([post("a", undefined, [definition("x")])]).projects

    expect(project.firstWritten).toBeUndefined()
    expect(project.lastWritten).toBeUndefined()
  })

  it("sorts projects by slug", () => {
    expect(aggregateProjects([post("a", "2024-01-01", [definition("zed"), definition("alpha")])]).projects.map((project) => project.slug)).toEqual(["alpha", "zed"])
  })
})
