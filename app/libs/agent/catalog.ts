import type { SiteGraph, SiteProject } from "./site-graph.server"

// Pure transforms from the site graph to the machine-readable post and project
// indexes. Like the other agent outputs, every object is built field by field
// from typed sources, so nothing outside the allowlist can appear here.

// value -> slugs, an inverted index so an agent can filter without reading
// every record. Keys are sorted; slugs keep the order of `entries`.
type Facet = Record<string, string[]>

const invert = <T extends { slug: string }>(entries: readonly T[], valuesOf: (entry: T) => readonly string[]): Facet => {
  const facet: Facet = {}
  for (const entry of entries) {
    for (const value of valuesOf(entry)) (facet[value] ??= []).push(entry.slug)
  }
  return Object.fromEntries(Object.entries(facet).sort(([a], [b]) => a.localeCompare(b)))
}

const absolute = (graph: SiteGraph, path: string) => new URL(path, graph.profile.url).href

type PostsDocument = {
  posts: Array<{
    slug: string
    url: string
    title: string
    description: string
    date: string | null
    category: string
    tags: string[]
    topics: string[]
    // Things Andrew built, maintains or contributes to.
    projects: string[]
    // Technologies the post is about using.
    technologies: string[]
    companies: string[]
    readingMinutes: number | null
    featured: boolean
  }>
  topics: Array<{ slug: string; label: string }>
  facets: {
    category: Facet
    tag: Facet
    topic: Facet
    project: Facet
    technology: Facet
    company: Facet
  }
}

const buildPostsDocument = (graph: SiteGraph): PostsDocument => ({
  posts: graph.posts.map((post) => ({
    slug: post.slug,
    url: absolute(graph, post.path),
    title: post.title,
    description: post.description,
    date: post.date ?? null,
    category: post.category,
    tags: post.tags,
    topics: post.topics,
    projects: post.projects,
    technologies: post.technologies,
    companies: post.companies,
    readingMinutes: post.readingMinutes ?? null,
    featured: post.featured,
  })),
  topics: graph.topics.map(({ slug, label }) => ({ slug, label })).sort((a, b) => a.slug.localeCompare(b.slug)),
  facets: {
    category: invert(graph.posts, (post) => [post.category]),
    tag: invert(graph.posts, (post) => post.tags),
    topic: invert(graph.posts, (post) => post.topics),
    project: invert(graph.posts, (post) => post.projects),
    technology: invert(graph.posts, (post) => post.technologies),
    company: invert(graph.posts, (post) => post.companies),
  },
})

const toProjectRecord = (graph: SiteGraph, project: SiteProject) => ({
  slug: project.slug,
  name: project.name,
  role: project.role,
  ...(project.summary ? { summary: project.summary } : {}),
  ...(project.url ? { url: project.url } : {}),
  ...(project.repo ? { repo: project.repo } : {}),
  ...(project.status ? { status: project.status } : {}),
  ...(project.company ? { company: project.company } : {}),
  firstWritten: project.firstWritten ?? null,
  lastWritten: project.lastWritten ?? null,
  topics: project.topics,
  posts: project.posts.map(({ slug, title, path, date }) => ({ slug, title, date: date ?? null, url: absolute(graph, path) })),
})

type ProjectsDocument = {
  // Things Andrew built, maintains or contributes to.
  projects: Array<ReturnType<typeof toProjectRecord>>
  // The separate "technologies I use" list: tools the posts are about using.
  technologiesIUse: Array<ReturnType<typeof toProjectRecord>>
  facets: { role: Facet; company: Facet; topic: Facet }
}

const buildProjectsDocument = (graph: SiteGraph): ProjectsDocument => {
  const all = [...graph.projects, ...graph.technologies]

  return {
    projects: graph.projects.map((project) => toProjectRecord(graph, project)),
    technologiesIUse: graph.technologies.map((project) => toProjectRecord(graph, project)),
    facets: {
      role: invert(all, (project) => [project.role]),
      company: invert(all, (project) => (project.company ? [project.company] : [])),
      topic: invert(all, (project) => project.topics),
    },
  }
}

export { buildPostsDocument, buildProjectsDocument }
export type { PostsDocument, ProjectsDocument }
