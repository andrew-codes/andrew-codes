import type { Recommendation } from "../../data/recommendations"
import { socialLinks } from "../../data/profile"
import { toCanonicalUrl } from "../meta"
import { markdownPaths } from "./markdown-paths"
import type { SiteGraph, SitePost } from "./site-graph.server"

// Markdown twins: plain markdown versions of the site's pages for agents. Each
// starts with an H1 and a `Source:` line naming the HTML page it mirrors, and
// links to other twins rather than to HTML so an agent can keep following
// links in the same format. Everything is built field by field from the site
// graph (which has no email, phone or address fields) and the post bodies, so
// nothing else can appear.

const absolute = (graph: SiteGraph, path: string) => new URL(path, graph.profile.url).href

const listPost = (graph: SiteGraph, post: SitePost): string => {
  const details = [post.date, post.description].filter(Boolean).join(" - ")
  return `- [${post.title}](${absolute(graph, markdownPaths.post(post.slug))})${details ? `: ${details}` : ""}`
}

const listPosts = (graph: SiteGraph, posts: readonly SitePost[]): string[] => posts.map((post) => listPost(graph, post))

const join = (blocks: readonly (string | string[])[]): string => `${blocks.flat().join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`

const renderPostMarkdown = (graph: SiteGraph, post: SitePost, body: string): string => {
  const tags = post.tags.filter((tag) => tag !== "featured")

  return join([
    `# ${post.title}`,
    "",
    ...(post.description ? [`> ${post.description}`, ""] : []),
    `- Source: ${toCanonicalUrl(post.path)}`,
    `- Author: ${graph.profile.displayName} (${graph.profile.url})`,
    ...(post.date ? [`- Published: ${post.date}`] : []),
    `- Category: ${post.category}`,
    ...(tags.length > 0 ? [`- Tags: ${tags.join(", ")}`] : []),
    ...(post.readingMinutes ? [`- Reading time: ${post.readingMinutes} min`] : []),
    "",
    body,
  ])
}

const renderPostsIndexMarkdown = (graph: SiteGraph): string =>
  join([
    "# Posts by Andrew Smith",
    "",
    `Articles on technology and software engineering. Source: ${toCanonicalUrl("/posts")}`,
    "",
    listPosts(graph, graph.posts),
  ])

const renderTagMarkdown = (graph: SiteGraph, tag: string): string =>
  join([
    `# Posts tagged "${tag}"`,
    "",
    `Posts by Andrew Smith about ${tag}. Source: ${toCanonicalUrl(`/tags/${tag}`)}`,
    "",
    listPosts(
      graph,
      graph.posts.filter((post) => post.tags.includes(tag)),
    ),
  ])

const renderRecommendationsMarkdown = (graph: SiteGraph, recommendations: readonly Recommendation[]): string =>
  join([
    "# Recommendations",
    "",
    `What peers, managers and leaders say about ${graph.profile.displayName}. Source: ${toCanonicalUrl("/recommendations")}`,
    ...recommendations.flatMap(({ author, paragraphs }) => [
      "",
      `## ${author.name}`,
      "",
      `![${author.name}](${absolute(graph, author.image)})`,
      "",
      `${author.title}, ${author.company.name}`,
      "",
      paragraphs.map((paragraph) => `> ${paragraph}`).join("\n>\n"),
    ]),
  ])

const LATEST_POSTS_ON_HOME = 3

const renderHomeMarkdown = (graph: SiteGraph): string => {
  const { profile } = graph
  const topicLabels = new Map(graph.topics.map((topic) => [topic.slug, topic.label]))
  const expertise = profile.expertise.map((slug) => topicLabels.get(slug)).filter((label): label is string => Boolean(label))

  return join([
    `# ${profile.displayName}`,
    "",
    `${profile.headline}, ${profile.location}`,
    "",
    `> ${profile.bio}`,
    "",
    `Source: ${toCanonicalUrl("/")}`,
    "",
    "## Elsewhere",
    "",
    ...socialLinks.map((link) => `- [${link.label}](${link.url})`),
    "",
    ...(expertise.length > 0 ? ["## Expertise", "", expertise.join(", "), ""] : []),
    "## Explore",
    "",
    `- [Resume](${absolute(graph, markdownPaths.resume)})`,
    `- [Recommendations](${absolute(graph, markdownPaths.recommendations)})`,
    `- [All posts](${absolute(graph, markdownPaths.posts)})`,
    `- [Site index for LLMs](${absolute(graph, markdownPaths.llms)})`,
    "",
    "## Latest posts",
    "",
    listPosts(graph, graph.posts.slice(0, LATEST_POSTS_ON_HOME)),
  ])
}

export { renderHomeMarkdown, renderPostMarkdown, renderPostsIndexMarkdown, renderRecommendationsMarkdown, renderTagMarkdown }
