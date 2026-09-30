import type { MdxListItem, ProjectFrontMatter, ProjectRole, ProjectStatus } from "../../types"
import { projectRoles, projectStatuses } from "../../types"

// Validation and aggregation for the optional front matter fields that tie a
// post to the wider site: `featured`, `projects` and `companies` (documented
// in app/posts/AGENTS.md). A project is not a record anyone maintains: it
// exists because a post says it does, and everything here is computed from
// post front matter at build time. Every function is pure and reports
// authoring mistakes as human-readable problems rather than throwing, so the
// site graph can list all of them at once.

type Company = { slug: string; name: string; url?: string }

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/

const PROJECT_KEYS = ["slug", "name", "role", "url", "repo", "summary", "status", "company"] as const
const DEFINITION_FIELDS = ["name", "role", "url", "repo", "summary", "status", "company"] as const

// What one post says about itself, before projects are joined across posts.
type PostRelations = {
  featured: boolean
  // Company slugs, deduped, in authored order.
  companies: string[]
  // Every project the post mentions, in authored order. A definition carries
  // its details; a bare reference is just the slug.
  projects: Array<{ slug: string; definition?: ProjectFrontMatter }>
}

type ParsedRelations = { relations: PostRelations; problems: string[] }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password
  } catch {
    return false
  }
}

const list = (values: readonly string[]) => values.map((value) => `\`${value}\``).join(", ")

const parseProject = (entry: unknown, where: string, companySlugs: ReadonlySet<string>, problems: string[]): { slug: string; definition?: ProjectFrontMatter } | undefined => {
  if (typeof entry === "string") {
    if (!KEBAB_CASE.test(entry)) {
      problems.push(`${where}: project reference \`${entry}\` must be a kebab-case slug`)
      return undefined
    }
    return { slug: entry }
  }

  if (!isRecord(entry)) {
    problems.push(`${where}: each project must be a slug or an object with slug, name and role`)
    return undefined
  }

  const slug = entry.slug
  if (typeof slug !== "string" || !KEBAB_CASE.test(slug)) {
    problems.push(`${where}: project \`slug\` must be a kebab-case string, got ${JSON.stringify(slug)}`)
    return undefined
  }
  const at = `${where}: project \`${slug}\``
  const before = problems.length

  for (const key of Object.keys(entry)) {
    if (!(PROJECT_KEYS as readonly string[]).includes(key)) problems.push(`${at} has an unknown field \`${key}\` (allowed: ${list(PROJECT_KEYS)})`)
  }
  for (const field of ["name", "summary"] as const) {
    const value = entry[field]
    if (value !== undefined && (typeof value !== "string" || !value.trim())) problems.push(`${at} \`${field}\` must be a non-empty string`)
  }
  if (typeof entry.name !== "string") problems.push(`${at} needs a \`name\` (or, to refer to a project defined in another post, use the bare slug)`)
  if (!(projectRoles as readonly unknown[]).includes(entry.role)) problems.push(`${at} \`role\` must be one of ${list(projectRoles)}, got ${JSON.stringify(entry.role)}`)
  if (entry.status !== undefined && !(projectStatuses as readonly unknown[]).includes(entry.status)) problems.push(`${at} \`status\` must be one of ${list(projectStatuses)}, got ${JSON.stringify(entry.status)}`)
  for (const field of ["url", "repo"] as const) {
    const value = entry[field]
    if (value !== undefined && (typeof value !== "string" || !isHttpUrl(value))) problems.push(`${at} \`${field}\` must be an http(s) URL, got ${JSON.stringify(value)}`)
  }
  if (entry.company !== undefined && (typeof entry.company !== "string" || !companySlugs.has(entry.company))) {
    problems.push(`${at} \`company\` must be one of ${list([...companySlugs])}, got ${JSON.stringify(entry.company)}`)
  }

  if (problems.length > before) return undefined
  return { slug, definition: entry as unknown as ProjectFrontMatter }
}

// Reads and validates the relation fields of one post's front matter. `tags`
// is checked too, because it feeds topics: only its shape (a list of
// non-empty strings) and the retired `featured` tag are errors. A tag the
// topic list does not know is never a problem (see app/data/topics.ts).
const parsePostRelations = (slug: string, frontmatter: MdxListItem["frontmatter"], companies: readonly Company[]): ParsedRelations => {
  const where = `post \`${slug}\``
  const problems: string[] = []
  const companySlugs = new Set(companies.map((company) => company.slug))
  const raw = frontmatter as Record<string, unknown>

  if (raw.featured !== undefined && typeof raw.featured !== "boolean") problems.push(`${where}: \`featured\` must be true or false, got ${JSON.stringify(raw.featured)}`)

  if (raw.tags !== undefined) {
    if (!Array.isArray(raw.tags) || raw.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      problems.push(`${where}: \`tags\` must be a list of non-empty strings`)
    } else if (raw.tags.some((tag: string) => tag.trim().toLowerCase() === "featured")) {
      problems.push(`${where}: \`featured\` is a front matter field now, not a tag - remove it from \`tags\` and add \`featured: true\``)
    }
  }

  const parsedCompanies: string[] = []
  if (raw.companies !== undefined) {
    if (!Array.isArray(raw.companies)) {
      problems.push(`${where}: \`companies\` must be a list of company slugs`)
    } else {
      for (const company of raw.companies) {
        if (typeof company !== "string" || !companySlugs.has(company)) {
          problems.push(`${where}: unknown company ${JSON.stringify(company)} (known companies: ${list([...companySlugs])})`)
        } else if (!parsedCompanies.includes(company)) {
          parsedCompanies.push(company)
        }
      }
    }
  }

  const projects: PostRelations["projects"] = []
  if (raw.projects !== undefined) {
    if (!Array.isArray(raw.projects)) {
      problems.push(`${where}: \`projects\` must be a list`)
    } else {
      for (const entry of raw.projects) {
        const project = parseProject(entry, where, companySlugs, problems)
        if (!project) continue
        if (projects.some((existing) => existing.slug === project.slug)) {
          problems.push(`${where}: project \`${project.slug}\` is listed twice`)
        } else {
          projects.push(project)
        }
      }
    }
  }

  return { relations: { featured: raw.featured === true, companies: parsedCompanies, projects }, problems }
}

type ProjectPost = {
  slug: string
  title: string
  path: string
  date: string | undefined
  topics: readonly string[]
  projects: PostRelations["projects"]
}

type SiteProject = {
  slug: string
  name: string
  role: ProjectRole
  url?: string
  repo?: string
  summary?: string
  status?: ProjectStatus
  company?: string
  // Dates of the oldest and newest dated posts that mention the project.
  firstWritten?: string
  lastWritten?: string
  // Newest first.
  posts: Array<{ slug: string; title: string; path: string; date: string | undefined }>
  // Topic slugs the project's posts are tagged with, in first-seen order.
  topics: string[]
}

type ProjectAggregation = { projects: SiteProject[]; problems: string[] }

// Joins projects across posts. A project's details are merged from every post
// that defines it: a field may appear in several posts but must agree, so a
// conflict is an error naming both posts rather than a silent "newest wins".
// A bare slug must resolve to a definition somewhere.
const aggregateProjects = (posts: readonly ProjectPost[]): ProjectAggregation => {
  const problems: string[] = []
  const oldestFirst = [...posts].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "") || a.slug.localeCompare(b.slug))
  const definitions = new Map<string, { merged: Partial<Record<(typeof DEFINITION_FIELDS)[number], string>>; source: Map<string, string> }>()

  for (const post of oldestFirst) {
    for (const { slug, definition } of post.projects) {
      if (!definition) continue
      const entry = definitions.get(slug) ?? { merged: {}, source: new Map<string, string>() }
      definitions.set(slug, entry)

      for (const field of DEFINITION_FIELDS) {
        const value = definition[field]
        if (value === undefined) continue
        const existing = entry.merged[field]
        if (existing !== undefined && existing !== value) {
          problems.push(`project \`${slug}\`: \`${field}\` is ${JSON.stringify(existing)} in post \`${entry.source.get(field)}\` but ${JSON.stringify(value)} in post \`${post.slug}\``)
        } else if (existing === undefined) {
          entry.merged[field] = value
          entry.source.set(field, post.slug)
        }
      }
    }
  }

  const projects: SiteProject[] = []
  for (const [slug, { merged }] of definitions) {
    const mentions = posts.filter((post) => post.projects.some((project) => project.slug === slug))
    const dated = mentions.filter((post) => post.date).map((post) => post.date as string)
    projects.push({
      slug,
      name: merged.name as string,
      role: merged.role as ProjectRole,
      ...(merged.url ? { url: merged.url } : {}),
      ...(merged.repo ? { repo: merged.repo } : {}),
      ...(merged.summary ? { summary: merged.summary } : {}),
      ...(merged.status ? { status: merged.status as ProjectStatus } : {}),
      ...(merged.company ? { company: merged.company } : {}),
      ...(dated.length > 0 ? { firstWritten: dated.reduce((a, b) => (a < b ? a : b)), lastWritten: dated.reduce((a, b) => (a > b ? a : b)) } : {}),
      posts: mentions.map(({ slug: postSlug, title, path, date }) => ({ slug: postSlug, title, path, date })),
      topics: [...new Set(mentions.flatMap((post) => post.topics))],
    })
  }

  for (const post of posts) {
    for (const { slug } of post.projects) {
      if (!definitions.has(slug)) problems.push(`post \`${post.slug}\`: project \`${slug}\` is not defined in any post (define it with slug, name and role in one post, or fix the slug)`)
    }
  }

  return { projects: projects.sort((a, b) => a.slug.localeCompare(b.slug)), problems }
}

export { aggregateProjects, parsePostRelations }
export type { Company, PostRelations, ProjectAggregation, ProjectPost, SiteProject }
