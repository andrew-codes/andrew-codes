import { feed, profile } from "../../data/profile"
import { FEATURED_TAG, resolveTopics, topics, type Topic } from "../../data/topics"
import type { Category, MdxListItem } from "../../types"
import { getMdxPostSources, type MdxPostSource } from "../mdx.server"
import { toIsoDate } from "../utils"

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
  // Controlled-vocabulary topic slugs resolved from `tags`.
  topics: string[]
  featured: boolean
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
  topics: readonly Topic[]
  // Newest first; ties broken by slug so the order is deterministic.
  posts: SitePost[]
  invalidPosts: InvalidPost[]
  // Distinct authored tags in first-seen order.
  tags: string[]
  // Authored tags that are not in the topic vocabulary.
  unknownTags: string[]
}

const toSitePost = ({ slug, frontmatter, readTime }: MdxListItem): { post: SitePost; unknown: string[] } => {
  const tags = frontmatter.tags ?? []
  const resolved = resolveTopics(tags)

  return {
    post: {
      slug,
      path: `/posts/${slug}`,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      date: toIsoDate(frontmatter.date),
      category: frontmatter.category,
      tags,
      topics: resolved.topics.map((topic) => topic.slug),
      featured: tags.includes(FEATURED_TAG),
      readingMinutes: readTime ? Math.max(1, Math.ceil(readTime.minutes)) : undefined,
    },
    unknown: resolved.unknown,
  }
}

const buildSiteGraph = (sources: readonly MdxPostSource[]): SiteGraph => {
  const pages = sources.flatMap((source) => (source.listItem ? [source.listItem] : []))
  const entries = pages.map(toSitePost)

  const posts = entries.map((entry) => entry.post).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug))
  const invalidPosts = sources
    .flatMap((source) => (source.listItem ? [] : [{ slug: source.slug, path: `/posts/${source.slug}`, message: source.error.message }]))
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return {
    profile,
    topics,
    posts,
    invalidPosts,
    tags: [...new Set(pages.flatMap((page) => page.frontmatter.tags ?? []))],
    unknownTags: [...new Set(entries.flatMap((entry) => entry.unknown))],
  }
}

// Every route that is prerendered at build time.
const getPrerenderPaths = (graph: SiteGraph): string[] => [
  ...STATIC_PATHS,
  ...graph.posts.map((post) => post.path),
  ...graph.invalidPosts.map((post) => post.path),
  ...graph.tags.map((tag) => `/tags/${tag}`),
  ...CRAWLER_PATHS,
]

// The graph is memoised per instance so every consumer in a build process
// shares one read of the posts. A rejected load is not cached.
const createSiteGraphLoader = (loadSources: () => Promise<MdxPostSource[]>) => {
  let cached: Promise<SiteGraph> | undefined

  return () => {
    if (!cached) {
      const pending = loadSources().then(buildSiteGraph)
      pending.catch(() => {
        if (cached === pending) cached = undefined
      })
      cached = pending
    }
    return cached
  }
}

const getSiteGraph = createSiteGraphLoader(() => getMdxPostSources())

export { CRAWLER_PATHS, STATIC_PATHS, buildSiteGraph, createSiteGraphLoader, getPrerenderPaths, getSiteGraph }
export type { InvalidPost, SiteGraph, SitePost }
