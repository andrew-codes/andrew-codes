import { feed } from "../../data/profile"
import { STATIC_PATHS, type SiteGraph, type SitePost } from "./site-graph.server"

// Crawler-facing files - robots.txt, sitemap.xml and the Atom feed - built
// from the site graph and emitted by resource routes, so the prerender
// pipeline writes them into build/client beside the HTML.
//
// Every date comes from post front matter, never the build clock, so
// rebuilding without content changes produces byte-identical files.
//
// Cloudflare: the site is served behind Cloudflare, which has its own AI
// crawler controls (Security > Bots, "AI Crawl Control") and a managed
// robots.txt option that can prepend Disallow rules to this file. Those
// settings must agree with the policy below: search, agent access and model
// training are all allowed. If you change the Content-Signal line, change the
// Cloudflare settings to match, and the other way around. Check the served
// file with `curl -s https://andrew.codes/robots.txt` after any change to
// either side. Last checked by the site owner: AI crawlers allowed.

// Pages that are not worth indexing: /connect is a QR code card for in-person
// introductions, with no content of its own.
const SITEMAP_EXCLUDED_PATHS: ReadonlySet<string> = new Set(["/connect"])

type SitemapEntry = { loc: string; lastmod?: string }

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

// Authored tags can contain spaces ("home assistant"), so a tag's URL path
// must be percent-encoded to be a valid sitemap <loc>.
const absoluteUrl = (graph: SiteGraph, path: string): string => {
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
  return `${graph.profile.url}${encoded}`
}

// Posts are sorted newest first, but undated posts sort last, so the newest
// date is the first post that has one.
const newestDate = (posts: readonly SitePost[]): string | undefined => posts.find((post) => post.date)?.date

const buildRobotsTxt = (graph: SiteGraph): string =>
  [
    "# Search, AI input (agents, answer engines) and AI training are all allowed.",
    "# Cloudflare's AI crawler and managed robots.txt settings must agree with this file.",
    "User-agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    "",
    `Sitemap: ${graph.profile.url}/sitemap.xml`,
    "",
  ].join("\n")

const getSitemapEntries = (graph: SiteGraph): SitemapEntry[] => {
  const latest = newestDate(graph.posts)
  const staticLastmod: Record<string, string | undefined> = { "/": latest, "/posts": latest }

  const staticEntries = STATIC_PATHS
    .filter((path) => !SITEMAP_EXCLUDED_PATHS.has(path))
    .map((path) => ({ path, lastmod: staticLastmod[path] }))
  const postEntries = graph.posts.map((post) => ({ path: post.path, lastmod: post.date }))
  const tagEntries = graph.tags.map((tag) => ({
    path: `/tags/${tag}`,
    lastmod: newestDate(graph.posts.filter((post) => post.tags.includes(tag))),
  }))

  return [...staticEntries, ...postEntries, ...tagEntries].map(({ path, lastmod }) => ({
    loc: absoluteUrl(graph, path),
    ...(lastmod ? { lastmod } : {}),
  }))
}

const buildSitemapXml = (graph: SiteGraph): string => {
  const urls = getSitemapEntries(graph).map(
    ({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`,
  )

  return [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`, ""].join("\n")
}

// Atom timestamps need a time; front matter only carries a calendar date, so
// entries are stamped at UTC midnight of that date.
const toAtomDate = (isoDate: string): string => `${isoDate}T00:00:00Z`

const buildAtomFeed = (graph: SiteGraph): string => {
  // An entry without a date has no honest <updated>, so it stays out of the feed.
  const dated = graph.posts.filter((post): post is SitePost & { date: string } => Boolean(post.date))
  const feedUrl = absoluteUrl(graph, feed.path)
  const updated = dated[0]?.date

  const entries = dated.map((post) => {
    const url = absoluteUrl(graph, post.path)
    return [
      `  <entry>`,
      `    <id>${escapeXml(url)}</id>`,
      `    <title>${escapeXml(post.title)}</title>`,
      `    <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>`,
      `    <published>${toAtomDate(post.date)}</published>`,
      `    <updated>${toAtomDate(post.date)}</updated>`,
      ...(post.description ? [`    <summary>${escapeXml(post.description)}</summary>`] : []),
      `    <category term="${escapeXml(post.category)}"/>`,
      ...post.tags.map((tag) => `    <category term="${escapeXml(tag)}"/>`),
      `  </entry>`,
    ].join("\n")
  })

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom">`,
    `  <id>${escapeXml(`${graph.profile.url}/`)}</id>`,
    `  <title>${escapeXml(feed.title)}</title>`,
    `  <subtitle>${escapeXml(graph.profile.bio)}</subtitle>`,
    `  <link rel="self" type="application/atom+xml" href="${escapeXml(feedUrl)}"/>`,
    `  <link rel="alternate" type="text/html" href="${escapeXml(`${graph.profile.url}/posts`)}"/>`,
    ...(updated ? [`  <updated>${toAtomDate(updated)}</updated>`] : []),
    `  <author>`,
    `    <name>${escapeXml(graph.profile.name)}</name>`,
    `    <uri>${escapeXml(graph.profile.url)}</uri>`,
    `  </author>`,
    ...entries,
    `</feed>`,
    "",
  ].join("\n")
}

export { buildAtomFeed, buildRobotsTxt, buildSitemapXml, getSitemapEntries }
