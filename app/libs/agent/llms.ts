import { feed, socialLinks } from "../../data/profile"
import { markdownPaths } from "./markdown-paths"
import type { SiteGraph } from "./site-graph.server"

// llms.txt (https://llmstxt.org) and llms-full.txt, built from the site graph.
// llms.txt is the curated index an agent reads first; every link points at a
// markdown twin. llms-full.txt is the whole site as one document, so an agent
// with the context budget can ingest it in a single fetch.

const absolute = (graph: SiteGraph, path: string) => new URL(path, graph.profile.url).href

const link = (graph: SiteGraph, label: string, path: string, note?: string) => `- [${label}](${absolute(graph, path)})${note ? `: ${note}` : ""}`

const buildLlmsTxt = (graph: SiteGraph): string => {
  const { profile } = graph
  const tags = graph.tags.filter((tag) => tag !== "featured")

  return `${[
    `# ${profile.displayName}`,
    "",
    `> ${profile.headline} in ${profile.location}. ${profile.bio}`,
    "",
    `Personal site of ${profile.name}: a resume, recommendations from peers and managers, and articles on software engineering, agile and home automation. Every page has a markdown version at the same path with \`.md\` appended.`,
    "",
    "## About",
    "",
    link(graph, "Home", markdownPaths.home, "profile, links and latest posts"),
    link(graph, "Resume", markdownPaths.resume, "experience, skills and education"),
    link(graph, "Recommendations", markdownPaths.recommendations, "what peers, managers and leaders say"),
    "",
    "## Posts",
    "",
    ...graph.posts.map((post) => link(graph, post.title, markdownPaths.post(post.slug), [post.date, post.description].filter(Boolean).join(" - "))),
    "",
    ...(tags.length > 0 ? ["## Tags", "", ...tags.map((tag) => link(graph, tag, markdownPaths.tag(tag))), ""] : []),
    "## Optional",
    "",
    link(graph, "Everything in one file", markdownPaths.llmsFull, "the resume, recommendations and every post in full"),
    link(graph, "All posts", markdownPaths.posts),
    link(graph, "Atom feed", feed.path),
    link(graph, "Sitemap", "/sitemap.xml"),
    ...socialLinks.map((social) => `- [${social.label}](${social.url})`),
  ].join("\n")}\n`
}

type FullSection = { markdown: string }

// The full-content file: an intro, then each twin's document in turn, separated
// by horizontal rules. Each document keeps its own H1 and `Source:` line.
const buildLlmsFullTxt = (graph: SiteGraph, documents: readonly FullSection[]): string => {
  const { profile } = graph
  const intro = [
    `# ${profile.displayName} - full site content`,
    "",
    `> ${profile.headline} in ${profile.location}. ${profile.bio}`,
    "",
    `The complete content of ${profile.url} as markdown: the resume, recommendations and every post. The curated index is at ${absolute(graph, markdownPaths.llms)}.`,
  ].join("\n")

  return `${[intro, ...documents.map((document) => document.markdown.trim())].join("\n\n---\n\n")}\n`
}

export { buildLlmsFullTxt, buildLlmsTxt }
export type { FullSection }
