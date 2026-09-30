import type { Recommendation } from "../../data/recommendations"
import { profile } from "../../data/profile"
import { toCanonicalUrl } from "../meta"
import { absoluteUrl } from "./envelope"

// The Person node every structured-data entry points back to. The Person
// itself is described once, on the home page; other pages reference it by @id.
const PERSON_ID = `${profile.url}/#me`

const SCHEMA_CONTEXT = "https://schema.org"

type JsonLd = Record<string, unknown>

type BlogPostingInput = {
  slug: string
  title: string
  description: string
  // `YYYY-MM-DD`, or any ISO 8601 date-time.
  date?: string
  category?: string
  tags?: readonly string[]
}

// Tags that steer site behaviour rather than describe a post (see meta.ts).
const NON_TOPIC_TAGS: readonly string[] = ["featured"]

const toAbsoluteUrl = (path: string) => new URL(path, profile.url).href

// One Review per recommendation, reviewing the site owner. Names, titles,
// employers and photos are the public fields the captain approved.
const buildReviewJsonLd = (recommendations: readonly Recommendation[]) => ({
  "@context": SCHEMA_CONTEXT,
  "@graph": recommendations.map(({ id, author, paragraphs }) => ({
    "@type": "Review",
    "@id": absoluteUrl(`/recommendations#${id}`),
    reviewBody: paragraphs.join("\n\n"),
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.title,
      image: absoluteUrl(author.image),
      worksFor: { "@type": "Organization", name: author.company.name },
    },
    itemReviewed: { "@type": "Person", "@id": PERSON_ID, name: profile.name },
  })),
})

// ProfilePage wrapping the Person built by buildPersonJsonLd: the Person keeps
// its `@id`, so other pages can reference it without repeating the profile.
const buildProfilePageJsonLd = (person: JsonLd): JsonLd => {
  const { "@context": _context, ...mainEntity } = person

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ProfilePage",
    "@id": `${toCanonicalUrl("/")}#profile`,
    url: toCanonicalUrl("/"),
    name: `${profile.displayName} | ${profile.headline}`,
    mainEntity,
  }
}

const buildBlogPostingJsonLd = ({ slug, title, description, date, category, tags = [] }: BlogPostingInput): JsonLd => {
  const url = toCanonicalUrl(`/posts/${encodeURIComponent(slug)}`)
  const keywords = tags.filter((tag) => !NON_TOPIC_TAGS.includes(tag))

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: toAbsoluteUrl(profile.image),
    inLanguage: "en-US",
    ...(date ? { datePublished: date } : {}),
    ...(category ? { articleSection: category } : {}),
    ...(keywords.length > 0 ? { keywords } : {}),
    author: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: profile.url },
  }
}

export { PERSON_ID, buildBlogPostingJsonLd, buildProfilePageJsonLd, buildReviewJsonLd }
export type { BlogPostingInput, JsonLd }
