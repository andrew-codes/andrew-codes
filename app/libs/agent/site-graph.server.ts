import { companies as recommenderCompanies } from "../../data/companies"
import { feed, profile } from "../../data/profile"
import { resume, type Resume } from "../../data/resume"
import { recommendations, type Recommendation } from "../../data/recommendations"
import { resolveTopics, type Topic } from "../../data/topics"
import type { Category, MdxListItem } from "../../types"
import { getMdxPostSources, type MdxPostSource } from "../mdx.server"
import { toIsoDate } from "../utils"
import { FIXED_MARKDOWN_PATHS, markdownPaths } from "./markdown-paths"
import { RECOMMENDATIONS_PATH } from "./recommendations-document"
import { aggregateProjects, parsePostRelations, type Company, type PostRelations, type SiteProject } from "./relations"

// The site graph is the one typed, validated view of site content that
// everything machine-facing (prerender list, and later the JSON endpoints,
// markdown twins, feeds and structured data) is built from. It reads posts
// once per build process and combines them with the data modules in
// app/data. Posts are read as front matter only - never compiled - so
// enumerating routes is cheap and a post that fails to compile only fails its
// own prerender. Fields are copied one by one from typed sources, so nothing
// outside the allowlist (email, phone, address) can reach consumers.

const STATIC_PATHS = ["/", "/posts", "/recommendations", "/connect", "/connect-with-me"] as const

// Resource routes (app/routes/*.ts) that emit crawler files rather than pages.
const CRAWLER_PATHS = ["/robots.txt", "/sitemap.xml", feed.path] as const

// Machine-readable resource routes (not pages): the resume, the markdown twins
// that exist once, and the llms.txt files. Per-post and per-tag twins are added
// by getPrerenderPaths.
const RESOURCE_PATHS = ["/agent/resume.json", markdownPaths.resume, "/agent/posts.json", "/agent/projects.json", RECOMMENDATIONS_PATH, ...FIXED_MARKDOWN_PATHS, markdownPaths.llms, markdownPaths.llmsFull] as const

type SitePost = {
  slug: string
  path: string
  title: string
  description: string
  date: string | undefined
  category: Category
  // Front matter tags exactly as authored: these are the /tags/:id URLs, so
  // they must not be normalised.
  tags: string[]
  // Topic slugs resolved from `tags` (curated, or derived from the tag text).
  topics: string[]
  featured: boolean
  // Company slugs from front matter, all present in `SiteGraph.companies`.
  companies: string[]
  // Slugs of the projects Andrew built, maintains or contributes to.
  projects: string[]
  // Slugs of the technologies the post is about using (role `user`).
  technologies: string[]
  readingMinutes: number | undefined
}

// A post file whose front matter could not be read. It is still routable (its
// slug comes from the file name), so its own prerender reports the failure.
type InvalidPost = {
  slug: string
  path: string
  message: string
}

type SiteGraph = {
  profile: typeof profile
  resume: Resume
  // Every topic at least one post is tagged with, in first-seen order.
  topics: Topic[]
  // Companies a post may name: the resume company slugs plus recommender-only organisations.
  companies: Company[]
  recommendations: readonly Recommendation[]
  // Newest first; ties broken by slug so the order is deterministic.
  posts: SitePost[]
  invalidPosts: InvalidPost[]
  // Projects Andrew built, maintains or contributes to.
  projects: SiteProject[]
  // Technologies the site's posts are about using (project role `user`).
  technologies: SiteProject[]
  // Distinct authored tags in first-seen order.
  tags: string[]
  // Authored tags with no curated topic, which got a derived one. Informational.
  derivedTags: string[]
  // Authoring mistakes in post front matter. A site graph with problems must
  // not be published: getSiteGraph() rejects with all of them listed.
  problems: string[]
}

// The company registry: the resume's company slugs, plus organisations that
// only appear in app/data/companies (they recommended Andrew but are not
// employers). The resume entry wins where both name a slug.
const getCompanies = (resume: Resume): Company[] => {
  const bySlug = new Map<string, Company>()
  for (const { company } of resume.experience) {
    if (!bySlug.has(company.slug)) bySlug.set(company.slug, company)
  }
  for (const { slug, name } of recommenderCompanies) {
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, name })
  }
  return [...bySlug.values()]
}

type PostDraft = Omit<SitePost, "projects" | "technologies"> & { relations: PostRelations }

const toPostDraft = ({ slug, frontmatter, readTime }: MdxListItem, companies: readonly Company[]) => {
  const parsed = parsePostRelations(slug, frontmatter, companies)
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())) : []
  const resolved = resolveTopics(tags)

  const draft: PostDraft = {
    slug,
    path: `/posts/${slug}`,
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? "",
    date: toIsoDate(frontmatter.date),
    category: frontmatter.category,
    tags,
    topics: resolved.topics.map((topic) => topic.slug),
    featured: parsed.relations.featured,
    companies: parsed.relations.companies,
    readingMinutes: readTime ? Math.max(1, Math.ceil(readTime.minutes)) : undefined,
    relations: parsed.relations,
  }

  return { draft, topics: resolved.topics, derivedFrom: resolved.derivedFrom, problems: parsed.problems }
}

const byNewest = (a: { date?: string; slug: string }, b: { date?: string; slug: string }) => (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug)

const buildSiteGraph = (sources: readonly MdxPostSource[]): SiteGraph => {
  const pages = sources.flatMap((source) => (source.listItem ? [source.listItem] : []))
  const companies = getCompanies(resume)
  const entries = pages.map((page) => toPostDraft(page, companies))

  const drafts = entries.map((entry) => entry.draft).sort(byNewest)
  const { projects: allProjects, problems: projectProblems } = aggregateProjects(
    drafts.map(({ slug, title, path, date, topics, relations }) => ({ slug, title, path, date, topics, projects: relations.projects })),
  )
  const isTechnology = new Set(allProjects.filter((project) => project.role === "user").map((project) => project.slug))

  const posts: SitePost[] = drafts.map(({ relations, ...post }) => ({
    ...post,
    projects: relations.projects.map((project) => project.slug).filter((slug) => !isTechnology.has(slug)),
    technologies: relations.projects.map((project) => project.slug).filter((slug) => isTechnology.has(slug)),
  }))
  const invalidPosts = sources
    .flatMap((source) => (source.listItem ? [] : [{ slug: source.slug, path: `/posts/${source.slug}`, message: source.error.message }]))
    .sort((a, b) => a.slug.localeCompare(b.slug))

  const topicsBySlug = new Map<string, Topic>()
  for (const entry of entries) for (const topic of entry.topics) if (!topicsBySlug.has(topic.slug)) topicsBySlug.set(topic.slug, topic)

  return {
    profile,
    resume,
    topics: [...topicsBySlug.values()],
    companies,
    recommendations,
    posts,
    invalidPosts,
    projects: allProjects.filter((project) => project.role !== "user"),
    technologies: allProjects.filter((project) => project.role === "user"),
    tags: [...new Set(entries.flatMap((entry) => entry.draft.tags))],
    derivedTags: [...new Set(entries.flatMap((entry) => entry.derivedFrom))],
    problems: [...entries.flatMap((entry) => entry.problems), ...projectProblems],
  }
}

// Every route that is prerendered at build time.
const getPrerenderPaths = (graph: SiteGraph): string[] => [
  ...STATIC_PATHS,
  ...RESOURCE_PATHS,
  ...graph.posts.map((post) => post.path),
  ...graph.invalidPosts.map((post) => post.path),
  ...graph.topics.map((topic) => `/tags/${topic.slug}`),
  ...graph.posts.map((post) => markdownPaths.post(post.slug)),
  ...graph.topics.map((topic) => markdownPaths.tag(topic.slug)),
  ...CRAWLER_PATHS,
]

class SiteGraphError extends Error {
  problems: string[]

  constructor(problems: string[]) {
    super(`Post front matter is invalid (${problems.length} problem${problems.length === 1 ? "" : "s"}):\n${problems.map((problem) => `  - ${problem}`).join("\n")}`)
    this.name = "SiteGraphError"
    this.problems = problems
  }
}

const loadValidGraph = (sources: MdxPostSource[]): SiteGraph => {
  const graph = buildSiteGraph(sources)
  if (graph.problems.length > 0) throw new SiteGraphError(graph.problems)
  return graph
}

// The graph is memoised per instance so every consumer in a build process
// shares one read of the posts. A rejected load is not cached. Authoring
// mistakes in front matter reject the load, which fails the build with every
// problem listed; tags outside the curated topic list are not mistakes.
const createSiteGraphLoader = (loadSources: () => Promise<MdxPostSource[]>) => {
  let cached: Promise<SiteGraph> | undefined

  return () => {
    if (!cached) {
      const pending = loadSources().then(loadValidGraph)
      pending.catch(() => {
        if (cached === pending) cached = undefined
      })
      cached = pending
    }
    return cached
  }
}

const getSiteGraph = createSiteGraphLoader(() => getMdxPostSources())

export { CRAWLER_PATHS, RESOURCE_PATHS, SiteGraphError, STATIC_PATHS, buildSiteGraph, createSiteGraphLoader, getPrerenderPaths, getSiteGraph }
export type { InvalidPost, SiteGraph, SitePost, SiteProject }
