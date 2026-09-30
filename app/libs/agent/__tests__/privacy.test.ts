import { describe, expect, it } from "vitest"
import { recommendations } from "../../../data/recommendations"
import { resume } from "../../../data/resume"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildPostsDocument, buildProjectsDocument } from "../catalog"
import { buildLlmsFullTxt, buildLlmsTxt } from "../llms"
import { renderHomeMarkdown, renderPostMarkdown, renderPostsIndexMarkdown, renderRecommendationsMarkdown, renderTagMarkdown } from "../markdown-twins"
import { buildPersonJsonLd, buildResumeDocument, renderResumeMarkdown } from "../resume"
import { buildSiteGraph } from "../site-graph.server"
import { buildBlogPostingJsonLd, buildProfilePageJsonLd } from "../structured-data"

// Privacy allowlist: the machine layer must never expose an email address,
// phone number or street address. Every generated output is scanned, plus the
// resume source data (which is seeded from a PDF that does carry a phone and
// email in its header).

const FORBIDDEN: Record<string, RegExp> = {
  email: /[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i,
  "mailto/tel link": /\b(mailto|tel):/i,
  // Not an ISO date (2026-01-01), which structured data carries.
  phone: /(?<![\d-])(?!\d{4}-\d{2}-\d{2}(?!\d))\+?\d[\d\s().-]{8,}\d/,
  "street address": /\b\d{1,6}\s+(?:[A-Z][\w.]*\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Parkway|Pkwy)\b\.?/,
  "zip code": /\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/,
}

const scan = (label: string, text: string) => {
  const hits = Object.entries(FORBIDDEN).flatMap(([kind, pattern]) => {
    const match = text.match(pattern)
    return match ? [`${label}: ${kind} "${match[0]}"`] : []
  })
  expect(hits).toEqual([])
}

// The post and project indexes carry ISO dates (2026-08-12), which the phone
// pattern would read as a number. Dates are masked out before scanning them.
const scanIndex = (label: string, text: string) => scan(label, text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE"))

const post: MdxListItem = {
  slug: "react-post",
  frontmatter: { title: "A React post", description: "About React", category: "engineering", date: "2026-01-01", tags: ["react"] },
  readTime: { text: "", minutes: 1, time: 60000, words: 0 },
}
const graph = buildSiteGraph([{ slug: post.slug, listItem: post } satisfies MdxPostSource])

describe("privacy allowlist", () => {
  it("keeps email, phone and address out of the resume source data", () => {
    scan("resume data", JSON.stringify(resume))
  })

  it("keeps them out of /agent/resume.json", () => {
    scan("resume.json", JSON.stringify(buildResumeDocument(graph), null, 2))
  })

  it("keeps them out of /resume.md", () => {
    scan("resume.md", renderResumeMarkdown(buildResumeDocument(graph)))
  })

  it("keeps them out of /agent/posts.json and /agent/projects.json", () => {
    scanIndex("posts.json", JSON.stringify(buildPostsDocument(graph), null, 2))
    scanIndex("projects.json", JSON.stringify(buildProjectsDocument(graph), null, 2))
  })

  it("keeps them out of the real posts' projects and companies", async () => {
    const { getMdxPostSources } = await import("../../mdx.server")
    const realGraph = buildSiteGraph(await getMdxPostSources())

    scanIndex("real posts.json", JSON.stringify(buildPostsDocument(realGraph), null, 2))
    scanIndex("real projects.json", JSON.stringify(buildProjectsDocument(realGraph), null, 2))
  })

  it("keeps them out of the Person JSON-LD", () => {
    scan("person json-ld", JSON.stringify(buildPersonJsonLd(graph)))
  })

  it("keeps them out of the ProfilePage and BlogPosting JSON-LD", () => {
    scan("profile page json-ld", JSON.stringify(buildProfilePageJsonLd(buildPersonJsonLd(graph))))
    scan("blog posting json-ld", JSON.stringify(buildBlogPostingJsonLd({ slug: post.slug, title: "A React post", description: "About React", date: "2026-01-01" })))
  })

  describe("markdown twins and llms.txt", () => {
    // Post front matter dates are ISO calendar dates, which the phone pattern
    // would otherwise read as a number.
    const scanTwin = (label: string, text: string) => scan(label, text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE"))

    it("keeps them out of the home, posts, tag and recommendations twins", () => {
      scanTwin("index.md", renderHomeMarkdown(graph))
      scanTwin("posts.md", renderPostsIndexMarkdown(graph))
      scanTwin("tag twin", renderTagMarkdown(graph, "react"))
      scanTwin("recommendations.md", renderRecommendationsMarkdown(graph, recommendations))
    })

    it("keeps them out of a post twin's header", () => {
      scanTwin("post twin", renderPostMarkdown(graph, graph.posts[0], "Body."))
    })

    it("keeps them out of llms.txt and llms-full.txt", () => {
      scanTwin("llms.txt", buildLlmsTxt(graph))
      scanTwin("llms-full.txt", buildLlmsFullTxt(graph, [{ markdown: renderResumeMarkdown(buildResumeDocument(graph)) }]))
    })
  })

  it("has patterns that catch what they are meant to catch", () => {
    scan("sanity (expects no hits)", "Atlanta, GA")
    expect(() => scan("email", "reach me at someone@example.com")).toThrow()
    expect(() => scan("phone", "call 470 535 9093")).toThrow()
    scan("sanity (expects no hits)", "datePublished 2026-08-10")
    expect(() => scan("phone", "call +1 (470) 535-9093")).toThrow()
    expect(() => scan("link", "tel:4705359093")).toThrow()
    expect(() => scan("street", "12 Peachtree Street")).toThrow()
    expect(() => scan("zip", "Atlanta, GA 30303")).toThrow()
  })
})
