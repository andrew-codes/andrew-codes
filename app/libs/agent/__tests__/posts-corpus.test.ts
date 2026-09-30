import fs from "fs/promises"
import matter from "gray-matter"
import path from "path"
import { describe, expect, it } from "vitest"
import { getMdxPostSources } from "../../mdx.server"
import { buildSiteGraph, type SiteGraph } from "../site-graph.server"

// Runs the build-time validation over the real posts in app/posts, so a
// front matter mistake fails `yarn test` as well as `yarn build`.

const POSTS_DIR = path.resolve("app/posts")

const listMdx = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => (entry.isDirectory() ? listMdx(path.join(dir, entry.name)) : /\.mdx?$/.test(entry.name) && entry.name !== "AGENTS.md" ? [path.join(dir, entry.name)] : [])))
  return nested.flat()
}

// Ignores query, fragment and trailing slash: `repo?tab=readme#start` links the repo.
const canonical = (url: string) => {
  const parsed = new URL(url)
  return `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/$/, "")}`
}

const linkedUrls = async (): Promise<Set<string>> => {
  const links = new Set<string>()
  for (const file of await listMdx(POSTS_DIR)) {
    const { content } = matter(await fs.readFile(file, "utf8"))
    for (const match of content.matchAll(/https?:\/\/[^\s)>"'\]]+/g)) {
      try {
        links.add(canonical(match[0]))
      } catch {
        // Not a URL after all.
      }
    }
  }
  return links
}

const graphPromise: Promise<SiteGraph> = getMdxPostSources().then(buildSiteGraph)

describe("real posts", () => {
  it("have valid front matter", async () => {
    expect((await graphPromise).problems).toEqual([])
  })

  it("read every post file", async () => {
    const graph = await graphPromise

    expect(graph.invalidPosts).toEqual([])
    expect(graph.posts.length).toBe((await listMdx(POSTS_DIR)).length)
  })

  it("only give projects a url or repo that some post already links", async () => {
    const graph = await graphPromise
    const links = await linkedUrls()
    const unlinked = [...graph.projects, ...graph.technologies].flatMap((project) => [project.url, project.repo].flatMap((url) => (url && !links.has(canonical(url)) ? [`${project.slug}: ${url}`] : [])))

    expect(unlinked).toEqual([])
  })

  it("keep the same posts featured as when featured was a tag", async () => {
    const graph = await graphPromise

    expect(graph.posts.filter((post) => post.featured).map((post) => post.slug).sort()).toEqual(["agile-forecasting", "devtools-declared", "react-with-relay-graphql-talk", "voice-assistant", "workflow-delegated"])
  })

  it("resolve every tag to a listed topic page", async () => {
    const graph = await graphPromise
    const slugs = new Set(graph.topics.map((topic) => topic.slug))

    for (const post of graph.posts) {
      expect(post.topics.length).toBeGreaterThan(0)
      for (const topic of post.topics) expect(slugs.has(topic)).toBe(true)
    }
  })
})
