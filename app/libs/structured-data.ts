import { profile } from "../data/profile"
import { toCanonicalUrl } from "./meta"

// schema.org JSON-LD builders. Pure and free of server-only imports, so route
// `meta` functions can call them on the server at prerender time and again on
// the client during navigation. Every object is built field by field from the
// typed profile and front matter, which have no email, phone or address.

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

const SCHEMA_CONTEXT = "https://schema.org"

// The one identifier for the site owner: the home page's Person node carries
// it, and every BlogPosting author points back at it.
const personId = `${profile.url}/#person`

// Tags that steer site behaviour rather than describe a post (see meta.ts).
const NON_TOPIC_TAGS: readonly string[] = ["featured"]

const toAbsoluteUrl = (path: string) => new URL(path, profile.url).href

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
    author: { "@type": "Person", "@id": personId, name: profile.name, url: profile.url },
  }
}

export { buildBlogPostingJsonLd, buildProfilePageJsonLd, personId }
export type { BlogPostingInput, JsonLd }
