import type { MdxListItem } from "../../../types"
import { recommendations } from "../../../data/recommendations"
import type { MdxPostSource } from "../../mdx.server"
import type { DataSource } from "../agent-tools"
import { buildPostsDocument, buildProjectsDocument } from "../catalog"
import { renderPostMarkdown } from "../markdown-twins"
import { buildRecommendationsDocument } from "../recommendations-document"
import { buildResumeDocument } from "../resume"
import { buildSiteGraph, type SiteGraph } from "../site-graph.server"

// An in-memory stand-in for the deployed site: the same pure builders the
// prerendered /agent/*.json routes use, so tool handlers run against output of
// the real document code without a build.

const posts: MdxListItem[] = [
  { slug: "react-testing", frontmatter: { title: "Testing React components", description: "How I test components", category: "engineering", date: "2026-03-01", tags: ["react", "tdd"] }, readTime: { text: "", minutes: 4, time: 240000, words: 800 } },
  { slug: "graphql-schema", frontmatter: { title: "GraphQL schema design", description: "Designing a schema", category: "engineering", date: "2026-02-01", tags: ["graphql"] }, readTime: { text: "", minutes: 6, time: 360000, words: 1200 } },
  { slug: "estimating", frontmatter: { title: "Estimating without guessing", description: "Forecasting instead of estimating", category: "process", date: "2026-01-01", tags: ["forecasting"] }, readTime: { text: "", minutes: 3, time: 180000, words: 600 } },
]

const fixtureGraph = (): SiteGraph => buildSiteGraph(posts.map((listItem) => ({ slug: listItem.slug, listItem }) satisfies MdxPostSource))

const createGraphSource = (graph: SiteGraph, bodies: (slug: string) => string = (slug) => `Body of ${slug}.`): DataSource => {
  const documents: Record<string, unknown> = {
    "/agent/posts.json": buildPostsDocument(graph),
    "/agent/projects.json": buildProjectsDocument(graph),
    "/agent/resume.json": buildResumeDocument(graph),
    "/agent/recommendations.json": buildRecommendationsDocument(recommendations),
  }
  const twins = new Map(graph.posts.map((post) => [`/posts/${post.slug}.md`, renderPostMarkdown(graph, post, bodies(post.slug))]))

  return {
    // Round-tripped through JSON like a fetched file.
    json: async (path) => {
      if (!(path in documents)) throw new Error(`${path} returned 404`)
      return JSON.parse(JSON.stringify(documents[path]))
    },
    text: async (path) => {
      const twin = twins.get(path)
      if (twin === undefined) throw new Error(`${path} returned 404`)
      return twin
    },
  }
}

export { createGraphSource, fixtureGraph }
