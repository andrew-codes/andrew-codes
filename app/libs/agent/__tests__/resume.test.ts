import { describe, expect, it } from "vitest"
import { resume } from "../../../data/resume"
import type { MdxListItem } from "../../../types"
import type { MdxPostSource } from "../../mdx.server"
import { buildExpertiseEvidence, buildPersonJsonLd, buildResumeDocument, renderResumeMarkdown } from "../resume"
import { buildSiteGraph } from "../site-graph.server"

const page = (slug: string, tags: string[]): MdxListItem => ({
  slug,
  frontmatter: { title: `Post ${slug}`, description: "", category: "engineering", date: "2026-01-01", tags },
  readTime: { text: "", minutes: 1, time: 60000, words: 0 },
})

const graph = buildSiteGraph([page("react-post", ["react", "javascript"]), page("nix-post", ["nix"]), page("jest-post", ["jest"])].map((item): MdxPostSource => ({ slug: item.slug, listItem: item })))

describe("buildResumeDocument", () => {
  it("carries the whole resume plus the public person fields", () => {
    const document = buildResumeDocument(graph)

    expect(document.person).toEqual({ name: "James Andrew Smith", headline: "Staff Software Engineer", url: "https://andrew.codes", location: "Atlanta, GA" })
    expect(document.experience).toEqual(resume.experience)
    expect(document.education).toEqual(resume.education)
    expect(document.skills).toEqual(resume.skills)
  })
})

describe("buildExpertiseEvidence", () => {
  it("maps skills to the posts tagged with their topic, and drops skills no post backs", () => {
    const evidence = buildExpertiseEvidence(graph)

    expect(evidence).toEqual([
      { skill: "React.js", topic: "react", posts: [{ slug: "react-post", title: "Post react-post", path: "/posts/react-post" }] },
      { skill: "JavaScript", topic: "javascript", posts: [{ slug: "react-post", title: "Post react-post", path: "/posts/react-post" }] },
      { skill: "Jest", topic: "jest", posts: [{ slug: "jest-post", title: "Post jest-post", path: "/posts/jest-post" }] },
    ])
  })

  it("is empty when there are no posts", () => {
    expect(buildExpertiseEvidence(buildSiteGraph([]))).toEqual([])
  })
})

describe("renderResumeMarkdown", () => {
  const markdown = renderResumeMarkdown(buildResumeDocument(graph))

  it("renders every section", () => {
    for (const heading of ["# James Andrew Smith - Resume", "## Summary", "## Technical skills", "## Professional experience", "## Additional relevant experience", "## Education", "## Community and open source"]) {
      expect(markdown).toContain(heading)
    }
  })

  it("renders each job with its company, title and formatted dates", () => {
    expect(markdown).toContain("### Staff-level Software Engineer, Microsoft")
    expect(markdown).toContain("December 2020 - Present, Atlanta, GA")
    expect(markdown).toContain("February 2013 - September 2014, Atlanta, GA")
  })

  it("links the posts that back a skill with absolute URLs", () => {
    expect(markdown).toContain("- **React.js:** [Post react-post](https://andrew.codes/posts/react-post)")
  })
})

describe("buildPersonJsonLd", () => {
  const person = buildPersonJsonLd(graph)

  it("is a schema.org Person with a stable id", () => {
    expect(person).toMatchObject({ "@context": "https://schema.org", "@type": "Person", "@id": "https://andrew.codes/#me", name: "James Andrew Smith", jobTitle: "Staff Software Engineer" })
  })

  it("sets worksFor from the current role", () => {
    expect(person.worksFor).toEqual({ "@type": "Organization", name: "Microsoft" })
  })

  it("lists resume skills and profile expertise topics in knowsAbout without duplicates", () => {
    const knowsAbout = person.knowsAbout as string[]

    expect(knowsAbout).toContain("React.js")
    expect(knowsAbout).toContain("Kubernetes")
    expect(knowsAbout).toContain("Home Assistant")
    expect(new Set(knowsAbout).size).toBe(knowsAbout.length)
  })

  it("lists alma maters and social profiles, and never emits an address", () => {
    expect(person.alumniOf).toEqual([{ "@type": "EducationalOrganization", name: "Columbus State University" }])
    expect(person.sameAs).toEqual(["https://linkedin.com/in/JamesAndrewSmith", "https://github.com/andrew-codes"])
    expect(person).not.toHaveProperty("address")
    expect(person).not.toHaveProperty("email")
    expect(person).not.toHaveProperty("telephone")
  })
})
