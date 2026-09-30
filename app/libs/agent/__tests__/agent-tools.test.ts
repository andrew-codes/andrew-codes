import { describe, expect, it } from "vitest"
import { getMdxPostSources } from "../../mdx.server"
import { ToolError, resourceDefinitions, runTool, toolDefinitions, type ToolName } from "../agent-tools"
import { getPostMarkdown } from "../post-markdown.server"
import { buildSiteGraph } from "../site-graph.server"
import { createGraphSource, fixtureGraph } from "./agent-tools-source"
import { scan } from "./privacy-scan"

const source = createGraphSource(fixtureGraph())
const run = async (name: ToolName, input?: unknown) => runTool(name, source, input)
const runJson = async (name: ToolName, input?: unknown) => JSON.parse(await run(name, input))

describe("tool definitions", () => {
  it("lists the six read-only tools", () => {
    expect(toolDefinitions.map(({ name }) => name)).toEqual(["get_profile", "search_posts", "get_post", "get_resume", "list_recommendations", "list_projects"])
  })

  it("closes every input schema and describes every input", () => {
    for (const { inputSchema } of toolDefinitions) {
      expect(inputSchema.additionalProperties).toBe(false)
      for (const property of Object.values(inputSchema.properties)) expect(property.description).not.toBe("")
    }
  })
})

describe("get_profile", () => {
  it("returns the public profile and social links", async () => {
    const profile = await runJson("get_profile")

    expect(profile).toMatchObject({ name: "James Andrew Smith", location: "Atlanta, GA", url: "https://andrew.codes" })
    expect(profile.image).toBe("https://andrew.codes/images/andrew-smith.webp")
    expect(profile.links.map((link: { label: string }) => link.label)).toEqual(["LinkedIn", "GitHub"])
    expect(profile.expertise[0]).toEqual({ slug: "react", label: expect.any(String) })
  })

  it("does not link the resume PDF, which carries contact details", async () => {
    expect(await run("get_profile")).not.toMatch(/\.pdf|resumeUrl/i)
  })
})

describe("search_posts", () => {
  it("returns every post, newest first, without bodies", async () => {
    const result = await runJson("search_posts")

    expect(result).toMatchObject({ total: 3, returned: 3 })
    expect(result.posts.map((post: { slug: string }) => post.slug)).toEqual(["react-testing", "graphql-schema", "estimating"])
    expect(result.posts[0]).toMatchObject({ url: "https://andrew.codes/posts/react-testing", category: "engineering", tags: ["react", "tdd"] })
    expect(JSON.stringify(result)).not.toContain("Body of")
  })

  it("matches every word of a query, ignoring case", async () => {
    expect((await runJson("search_posts", { query: "TESTING react" })).posts.map((post: { slug: string }) => post.slug)).toEqual(["react-testing"])
    expect((await runJson("search_posts", { query: "react nothing" })).total).toBe(0)
  })

  it("filters by category and tag and combines filters", async () => {
    expect((await runJson("search_posts", { category: "process" })).posts.map((post: { slug: string }) => post.slug)).toEqual(["estimating"])
    expect((await runJson("search_posts", { tag: "GraphQL" })).posts.map((post: { slug: string }) => post.slug)).toEqual(["graphql-schema"])
    expect((await runJson("search_posts", { category: "engineering", tag: "forecasting" })).total).toBe(0)
  })

  it("filters by company and project", async () => {
    expect((await runJson("search_posts", { company: "no-such-company" })).total).toBe(0)
    expect((await runJson("search_posts", { project: "no-such-project" })).total).toBe(0)
  })

  it("limits results and reports the total", async () => {
    expect(await runJson("search_posts", { limit: 1 })).toMatchObject({ total: 3, returned: 1 })
    expect((await runJson("search_posts", { limit: 1000 })).returned).toBe(3)
    expect((await runJson("search_posts", { limit: 0 })).returned).toBe(1)
  })

  it("rejects arguments of the wrong type", async () => {
    await expect(run("search_posts", { query: 5 })).rejects.toThrow(ToolError)
    await expect(run("search_posts", { limit: "ten" })).rejects.toThrow(ToolError)
    await expect(run("search_posts", "react")).rejects.toThrow(ToolError)
  })
})

describe("get_post", () => {
  it("returns the post's markdown twin", async () => {
    const markdown = await run("get_post", { slug: "react-testing", format: "markdown" })

    expect(markdown).toMatch(/^# Testing React components\n/)
    expect(markdown).toContain("Body of react-testing.")
  })

  it("reports an unknown slug as a tool error", async () => {
    await expect(run("get_post", { slug: "nope" })).rejects.toThrow(/No post with slug "nope"/)
  })

  it("requires a slug", async () => {
    await expect(run("get_post", {})).rejects.toThrow(/"slug" is required/)
  })

  it("never turns the slug into a path", async () => {
    for (const slug of ["../agent/resume", "react-testing/../../agent/resume", "react-testing.md"]) {
      await expect(run("get_post", { slug })).rejects.toThrow(ToolError)
    }
  })

  it("rejects a format other than markdown", async () => {
    await expect(run("get_post", { slug: "react-testing", format: "html" })).rejects.toThrow(/markdown/)
  })
})

describe("get_resume", () => {
  it("returns the whole resume with the person and evidence", async () => {
    const resume = await runJson("get_resume")

    expect(resume.person.name).toBe("James Andrew Smith")
    expect(resume).toHaveProperty("experience")
    expect(resume).toHaveProperty("skills")
    expect(resume).toHaveProperty("education")
    expect(resume).toHaveProperty("expertiseEvidence")
  })

  it.each(["experience", "skills", "education"] as const)("returns only the %s section", async (section) => {
    const resume = await runJson("get_resume", { section })

    expect(Object.keys(resume).sort()).toEqual([section, "person"].sort())
  })

  it("rejects an unknown section", async () => {
    await expect(run("get_resume", { section: "salary" })).rejects.toThrow(/one of: experience, skills, education/)
  })
})

describe("list_recommendations", () => {
  it("lists every recommendation with the available companies", async () => {
    const result = await runJson("list_recommendations")

    expect(result.total).toBeGreaterThan(0)
    expect(result.total).toBe(result.recommendations.length)
    expect(result.companies.length).toBeGreaterThan(0)
    expect(result.recommendations[0].author).toEqual({ name: expect.any(String), title: expect.any(String), company: { slug: expect.any(String), name: expect.any(String) }, image: expect.stringMatching(/^https:\/\//) })
  })

  it("filters by company slug", async () => {
    const all = await runJson("list_recommendations")
    const [company] = all.companies
    const filtered = await runJson("list_recommendations", { company: company.toUpperCase() })

    expect(filtered.total).toBeGreaterThan(0)
    expect(filtered.recommendations.every((item: { author: { company: { slug: string } } }) => item.author.company.slug === company)).toBe(true)
    expect((await runJson("list_recommendations", { company: "no-such-company" })).total).toBe(0)
  })
})

describe("list_projects", () => {
  it("returns projects and the technologies Andrew uses", async () => {
    expect(await runJson("list_projects")).toEqual({ projects: expect.any(Array), technologiesIUse: expect.any(Array) })
  })

  it("filters by company and topic", async () => {
    expect(await runJson("list_projects", { company: "no-such-company" })).toEqual({ projects: [], technologiesIUse: [] })
    expect(await runJson("list_projects", { topic: "no-such-topic" })).toEqual({ projects: [], technologiesIUse: [] })
  })
})

describe("resources", () => {
  it("reads the same content as the matching tools", async () => {
    const byUri = Object.fromEntries(resourceDefinitions.map((resource) => [resource.uri, resource]))

    expect(Object.keys(byUri)).toEqual(["site://profile", "site://resume", "site://recommendations", "site://projects", "site://posts"])
    expect(await byUri["site://profile"].read(source)).toBe(await run("get_profile"))
    expect(await byUri["site://resume"].read(source)).toBe(await run("get_resume"))
    expect(await byUri["site://recommendations"].read(source)).toBe(await run("list_recommendations"))
    expect(await byUri["site://projects"].read(source)).toBe(await run("list_projects"))
    expect(JSON.parse(await byUri["site://posts"].read(source)).posts).toHaveLength(3)
  })
})

// Privacy: nothing a tool or resource returns may carry an email, phone or
// street address. This runs every tool and resource over the real posts (the
// real post bodies included) as well as the fixtures, using the same patterns
// as the artifact scan in privacy.test.ts.
describe("privacy", () => {
  // Post and project documents carry ISO dates, and post bodies link commits
  // by their 40-character SHA; the phone pattern would read a digit run in
  // either as a number.
  const scanOutput = (label: string, text: string) => scan(label, text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE").replace(/\b[0-9a-f]{40}\b/g, "SHA"))

  const scanEverything = async (label: string, tools: ReturnType<typeof createGraphSource>, slugs: string[]) => {
    const calls: Array<[ToolName, unknown?]> = [["get_profile"], ["search_posts"], ["get_resume"], ["list_recommendations"], ["list_projects"], ...(["experience", "skills", "education"] as const).map((section): [ToolName, unknown] => ["get_resume", { section }]), ...slugs.map((slug): [ToolName, unknown] => ["get_post", { slug }])]

    for (const [name, input] of calls) scanOutput(`${label} ${name} ${JSON.stringify(input ?? {})}`, await runTool(name, tools, input))
    for (const resource of resourceDefinitions) scanOutput(`${label} ${resource.uri}`, await resource.read(tools))
  }

  it("keeps contact details out of every tool and resource over fixtures", async () => {
    await scanEverything("fixture", source, ["react-testing", "graphql-schema", "estimating"])
  })

  it("keeps contact details out of every tool and resource over the real posts", async () => {
    const graph = buildSiteGraph(await getMdxPostSources())
    const bodies = new Map(await Promise.all(graph.posts.map(async (post) => [post.slug, await getPostMarkdown(post.slug)] as const)))

    await scanEverything("real", createGraphSource(graph, (slug) => bodies.get(slug) ?? ""), graph.posts.map((post) => post.slug))
  }, 120_000)

  it("would catch contact details if a document carried them", async () => {
    const leaky = createGraphSource(fixtureGraph(), () => "Write to someone@example.com or call +1 (470) 535-9093.")

    expect(() => scanOutput("leaky", "x")).not.toThrow()
    await expect(scanEverything("leaky", leaky, ["react-testing"])).rejects.toThrow()
  })
})
