import { describe, expect, it } from "vitest"
import { resume } from "../../../data/resume"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildPersonJsonLd, buildResumeDocument, renderResumeMarkdown } from "../resume"
import { buildSiteGraph } from "../site-graph.server"
import { buildBlogPostingJsonLd, buildProfilePageJsonLd } from "../../structured-data"

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

  it("keeps them out of the Person JSON-LD", () => {
    scan("person json-ld", JSON.stringify(buildPersonJsonLd(graph)))
  })

  it("keeps them out of the ProfilePage and BlogPosting JSON-LD", () => {
    scan("profile page json-ld", JSON.stringify(buildProfilePageJsonLd(buildPersonJsonLd(graph))))
    scan("blog posting json-ld", JSON.stringify(buildBlogPostingJsonLd({ slug: post.slug, title: "A React post", description: "About React", date: "2026-01-01" })))
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
