import { socialLinks } from "../../data/profile"
import { skillTopics, type Resume } from "../../data/resume"
import { topics } from "../../data/topics"
import { personId } from "../structured-data"
import type { SiteGraph, SitePost } from "./site-graph.server"

// Pure transforms from the site graph to the machine-readable resume outputs.
// Every output is built field by field from the typed data modules, which have
// no email, phone or address fields, so nothing outside the allowlist can
// appear here.

type EvidencePost = Pick<SitePost, "slug" | "title" | "path">

type ExpertiseEvidence = {
  skill: string
  topic: string
  posts: EvidencePost[]
}

type ResumeDocument = Resume & {
  person: {
    name: string
    headline: string
    url: string
    location: string
  }
  // Skills that the site's own posts back up, with those posts.
  expertiseEvidence: ExpertiseEvidence[]
}

const topicLabels = new Map<string, string>(topics.map((topic) => [topic.slug, topic.label]))

const buildExpertiseEvidence = (graph: SiteGraph): ExpertiseEvidence[] =>
  graph.resume.skills
    .flatMap((group) => group.items)
    .flatMap((skill) => {
      const topic = skillTopics[skill]
      if (!topic) return []
      const posts = graph.posts.filter((post) => post.topics.includes(topic)).map(({ slug, title, path }) => ({ slug, title, path }))
      return posts.length > 0 ? [{ skill, topic, posts }] : []
    })

const buildResumeDocument = (graph: SiteGraph): ResumeDocument => ({
  person: {
    name: graph.profile.name,
    headline: graph.profile.headline,
    url: graph.profile.url,
    location: graph.profile.location,
  },
  ...graph.resume,
  expertiseEvidence: buildExpertiseEvidence(graph),
})

const formatMonth = (value: string): string => {
  if (value === "present") return "Present"
  const [year, month] = value.split("-")
  const name = new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  return `${name} ${year}`
}

const renderResumeMarkdown = (document: ResumeDocument): string => {
  const { person } = document
  const lines: string[] = [`# ${person.name} - Resume`, "", `${person.headline}, ${person.location}`, "", `Website: ${person.url}`]
  for (const link of socialLinks) lines.push(`${link.label}: ${link.url}`)

  lines.push("", "## Summary", "", document.summary, "", "## Technical skills", "")
  for (const group of document.skills) lines.push(`- **${group.group}:** ${group.items.join(", ")}`)

  lines.push("", "## Professional experience")
  for (const job of document.experience) {
    lines.push("", `### ${job.title}, ${job.company.name}`, "", `${formatMonth(job.start)} - ${formatMonth(job.end)}${job.location ? `, ${job.location}` : ""}`, "", job.summary, "", `Technologies: ${job.technologies.join(", ")}`, "")
    for (const highlight of job.highlights) lines.push(`- ${highlight}`)
  }

  lines.push("", "## Additional relevant experience", "")
  for (const role of document.additional) lines.push(`- ${role.company}, ${role.title}`)

  lines.push("", "## Education", "")
  for (const item of document.education) lines.push(`- ${item.degree} in ${item.field}, ${item.school}`)

  lines.push("", "## Community and open source", "")
  for (const item of document.talksAndOss) lines.push(item.url ? `- [${item.label}](${item.url})` : `- ${item.label}`)

  if (document.expertiseEvidence.length > 0) {
    lines.push("", "## Expertise backed by writing on this site", "")
    for (const { skill, posts } of document.expertiseEvidence) {
      lines.push(`- **${skill}:** ${posts.map((post) => `[${post.title}](${new URL(post.path, person.url).href})`).join(", ")}`)
    }
  }

  return `${lines.join("\n")}\n`
}

type PersonJsonLd = Record<string, unknown>

// schema.org Person enriched from the resume. `address` is deliberately never
// emitted, and there is no contactPoint or email: the only contact channels
// are the public social profiles.
const buildPersonJsonLd = (graph: SiteGraph): PersonJsonLd => {
  const { profile, resume } = graph
  const current = resume.experience.find((job) => job.end === "present")
  const skills = resume.skills.flatMap((group) => group.items)
  const expertiseTopics = profile.expertise.map((slug) => topicLabels.get(slug)).filter((label): label is string => Boolean(label))

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    alternateName: profile.displayName,
    url: profile.url,
    image: new URL(profile.image, profile.url).href,
    jobTitle: profile.headline,
    description: profile.bio,
    sameAs: socialLinks.map((link) => link.url),
    ...(current
      ? {
          worksFor: {
            "@type": "Organization",
            name: current.company.name,
            ...(current.company.url ? { url: current.company.url } : {}),
          },
        }
      : {}),
    knowsAbout: [...new Set([...skills, ...expertiseTopics])],
    alumniOf: resume.education.map((item) => ({ "@type": "EducationalOrganization", name: item.school })),
  }
}

export { buildExpertiseEvidence, buildPersonJsonLd, buildResumeDocument, renderResumeMarkdown }
export type { ExpertiseEvidence, PersonJsonLd, ResumeDocument }
