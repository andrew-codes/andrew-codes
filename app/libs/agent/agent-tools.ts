import { profile, socialLinks } from "../../data/profile"
import { topics } from "../../data/topics"
import type { PostsDocument, ProjectsDocument } from "./catalog"
import type { buildRecommendationsDocument } from "./recommendations-document"
import type { ResumeDocument } from "./resume"

// The six read-only tools behind the Worker's /mcp endpoint and the browser's
// WebMCP registration. They are pure functions over a `DataSource`, so the
// Worker (static assets binding) and the browser (same-origin fetch) share one
// implementation, and both read the static documents the build already emits:
// nothing here has a data source of its own. Output is built from those
// documents and the public profile module, none of which has an email, phone
// or address field (see __tests__/agent-tools.test.ts).

type DataSource = {
  // Parsed JSON at a site path such as "/agent/posts.json".
  json(path: string): Promise<unknown>
  // Text at a site path such as "/posts/my-post.md".
  text(path: string): Promise<string>
}

// A problem the caller can act on (unknown slug, bad argument). Reported to
// the agent as a tool error, unlike an unexpected failure.
class ToolError extends Error {}

type JsonSchema = {
  type: "object"
  properties: Record<string, { type: "string" | "integer"; description: string; enum?: readonly string[]; minimum?: number; maximum?: number }>
  required?: string[]
  additionalProperties: false
}

type ToolName = "get_profile" | "search_posts" | "get_post" | "get_resume" | "list_recommendations" | "list_projects"

type ToolDefinition = {
  name: ToolName
  title: string
  description: string
  inputSchema: JsonSchema
}

const RESUME_SECTIONS = ["experience", "skills", "education"] as const
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

const object = (properties: JsonSchema["properties"] = {}, required?: string[]): JsonSchema => ({ type: "object", properties, ...(required ? { required } : {}), additionalProperties: false })

// The input schemas agents see. The Worker mirrors them as zod shapes (and a
// test keeps the two in step); WebMCP takes them as they are.
const toolDefinitions: readonly ToolDefinition[] = [
  {
    name: "get_profile",
    title: "Get profile",
    description: "Andrew Smith's public profile: name, headline, short bio, location (city), expertise topics and social accounts.",
    inputSchema: object(),
  },
  {
    name: "search_posts",
    title: "Search posts",
    description: "Search Andrew's blog posts. All filters are optional and combine with AND. Returns post summaries (no bodies), newest first; use get_post for a body.",
    inputSchema: object({
      query: { type: "string", description: "Words to look for in a post's title, description, tags, topics, category, projects and companies." },
      category: { type: "string", description: "Exact post category." },
      tag: { type: "string", description: "Exact tag as authored on the post." },
      company: { type: "string", description: "Company slug, as listed in get_resume or list_recommendations." },
      project: { type: "string", description: "Project or technology slug, as listed in list_projects." },
      limit: { type: "integer", description: `Maximum posts to return (default ${DEFAULT_LIMIT}, at most ${MAX_LIMIT}).`, minimum: 1, maximum: MAX_LIMIT },
    }),
  },
  {
    name: "get_post",
    title: "Get post",
    description: "One blog post as markdown, with its title, date, category and topics at the top.",
    inputSchema: object({
      slug: { type: "string", description: "Post slug, from search_posts." },
      format: { type: "string", description: "Only markdown is available.", enum: ["markdown"] },
    }, ["slug"]),
  },
  {
    name: "get_resume",
    title: "Get resume",
    description: "Andrew's resume as structured data, with the posts that back up each skill. Pass a section for part of it.",
    inputSchema: object({ section: { type: "string", description: "Only this part of the resume.", enum: RESUME_SECTIONS } }),
  },
  {
    name: "list_recommendations",
    title: "List recommendations",
    description: "Recommendations colleagues wrote about Andrew, with each author's name, title and employer.",
    inputSchema: object({ company: { type: "string", description: "Only recommendations from authors at this company slug." } }),
  },
  {
    name: "list_projects",
    title: "List projects",
    description: "Projects Andrew built, maintains or contributes to, and separately the technologies he uses, each with the posts that mention it.",
    inputSchema: object({
      company: { type: "string", description: "Only projects tied to this company slug." },
      topic: { type: "string", description: "Only projects with this topic slug." },
    }),
  },
]

const stringArg = (input: Record<string, unknown>, key: string): string | undefined => {
  const value = input[key]
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value !== "string") throw new ToolError(`"${key}" must be a string.`)
  return value.trim()
}

const limitArg = (input: Record<string, unknown>): number => {
  const value = input.limit
  if (value === undefined || value === null) return DEFAULT_LIMIT
  if (typeof value !== "number" || !Number.isFinite(value)) throw new ToolError('"limit" must be a number.')
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(value)))
}

const asInput = (value: unknown): Record<string, unknown> => {
  if (value === undefined || value === null) return {}
  if (typeof value !== "object" || Array.isArray(value)) throw new ToolError("Arguments must be an object.")
  return value as Record<string, unknown>
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

const absolute = (path: string) => new URL(path, profile.url).href

const format = (value: unknown) => JSON.stringify(value, null, 2)

const getPosts = async (source: DataSource) => (await source.json("/agent/posts.json")) as PostsDocument

const getProfile = async (): Promise<string> => {
  const topicLabels = new Map<string, string>(topics.map(({ slug, label }) => [slug, label]))

  // Deliberately not `resumeUrl`: the PDF it points at carries contact details.
  return format({
    name: profile.name,
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio,
    url: profile.url,
    image: absolute(profile.image),
    location: profile.location,
    expertise: profile.expertise.map((slug) => ({ slug, label: topicLabels.get(slug) ?? slug })),
    links: socialLinks.map(({ label, handle, url }) => ({ label, handle, url })),
  })
}

const searchPosts = async (source: DataSource, rawInput: unknown): Promise<string> => {
  const input = asInput(rawInput)
  const query = stringArg(input, "query")
  const category = stringArg(input, "category")
  const tag = stringArg(input, "tag")
  const company = stringArg(input, "company")
  const project = stringArg(input, "project")
  const limit = limitArg(input)
  const words = query?.toLowerCase().split(/\s+/).filter(Boolean) ?? []

  const matches = (await getPosts(source)).posts.filter((post) => {
    if (category && !same(post.category, category)) return false
    if (tag && !post.tags.some((candidate) => same(candidate, tag))) return false
    if (company && !post.companies.some((candidate) => same(candidate, company))) return false
    if (project && ![...post.projects, ...post.technologies].some((candidate) => same(candidate, project))) return false
    if (words.length === 0) return true

    const haystack = [post.title, post.description, post.category, ...post.tags, ...post.topics, ...post.projects, ...post.technologies, ...post.companies].join(" ").toLowerCase()
    return words.every((word) => haystack.includes(word))
  })

  return format({ total: matches.length, returned: Math.min(matches.length, limit), posts: matches.slice(0, limit) })
}

const getPost = async (source: DataSource, rawInput: unknown): Promise<string> => {
  const input = asInput(rawInput)
  const slug = stringArg(input, "slug")
  const requestedFormat = stringArg(input, "format")
  if (!slug) throw new ToolError('"slug" is required. Find one with search_posts.')
  if (requestedFormat && requestedFormat !== "markdown") throw new ToolError('"format" can only be "markdown".')

  // The slug is looked up in the posts index rather than put into a path, so
  // only a published post's twin can ever be requested.
  const known = (await getPosts(source)).posts.find((post) => post.slug === slug)
  if (!known) throw new ToolError(`No post with slug "${slug}". Find one with search_posts.`)

  return source.text(`/posts/${encodeURIComponent(known.slug)}.md`)
}

const getResume = async (source: DataSource, rawInput: unknown): Promise<string> => {
  const section = stringArg(asInput(rawInput), "section")
  if (section && !(RESUME_SECTIONS as readonly string[]).includes(section)) throw new ToolError(`"section" must be one of: ${RESUME_SECTIONS.join(", ")}.`)

  const document = (await source.json("/agent/resume.json")) as ResumeDocument
  if (!section) return format(document)

  return format({ person: document.person, [section]: document[section as (typeof RESUME_SECTIONS)[number]] })
}

const listRecommendations = async (source: DataSource, rawInput: unknown): Promise<string> => {
  const company = stringArg(asInput(rawInput), "company")
  const { data } = (await source.json("/agent/recommendations.json")) as ReturnType<typeof buildRecommendationsDocument>
  const recommendations = company ? data.recommendations.filter((recommendation) => same(recommendation.author.company.slug, company)) : data.recommendations

  return format({ total: recommendations.length, companies: Object.keys(data.facets.company).sort(), recommendations })
}

const listProjects = async (source: DataSource, rawInput: unknown): Promise<string> => {
  const input = asInput(rawInput)
  const company = stringArg(input, "company")
  const topic = stringArg(input, "topic")
  const document = (await source.json("/agent/projects.json")) as ProjectsDocument

  const keep = (project: ProjectsDocument["projects"][number]) => (!company || (project.company !== undefined && same(project.company, company))) && (!topic || project.topics.some((candidate) => same(candidate, topic)))

  return format({ projects: document.projects.filter(keep), technologiesIUse: document.technologiesIUse.filter(keep) })
}

const handlers: Record<ToolName, (source: DataSource, input: unknown) => Promise<string>> = {
  get_profile: getProfile,
  search_posts: searchPosts,
  get_post: getPost,
  get_resume: getResume,
  list_recommendations: listRecommendations,
  list_projects: listProjects,
}

// Runs one tool and returns the text an agent reads. A ToolError's message is
// for the agent; anything else is unexpected and propagates.
const runTool = (name: ToolName, source: DataSource, input: unknown): Promise<string> => handlers[name](source, input)

// Resources: the same content, addressed by URI, for hosts that let a person
// attach a resource rather than have the model call a tool.
type ResourceDefinition = { name: string; uri: string; title: string; description: string; mimeType: string; read: (source: DataSource) => Promise<string> }

const resourceDefinitions: readonly ResourceDefinition[] = [
  { name: "profile", uri: "site://profile", title: "Profile", description: "Andrew Smith's public profile and social accounts.", mimeType: "application/json", read: () => getProfile() },
  { name: "resume", uri: "site://resume", title: "Resume", description: "Andrew's structured resume.", mimeType: "application/json", read: (source) => getResume(source, {}) },
  { name: "recommendations", uri: "site://recommendations", title: "Recommendations", description: "Recommendations written about Andrew.", mimeType: "application/json", read: (source) => listRecommendations(source, {}) },
  { name: "projects", uri: "site://projects", title: "Projects", description: "Projects Andrew built or maintains, and the technologies he uses.", mimeType: "application/json", read: (source) => listProjects(source, {}) },
  { name: "posts", uri: "site://posts", title: "Posts index", description: "Every blog post with its metadata, facets and topics.", mimeType: "application/json", read: async (source) => format(await getPosts(source)) },
]

const POST_RESOURCE_TEMPLATE = "site://posts/{slug}"

export { MAX_LIMIT, POST_RESOURCE_TEMPLATE, RESUME_SECTIONS, ToolError, getPosts, resourceDefinitions, runTool, toolDefinitions }
export type { DataSource, JsonSchema, ResourceDefinition, ToolDefinition, ToolName }
