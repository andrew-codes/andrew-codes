import type { Recommendation } from "../../data/recommendations"
import { profile } from "../../data/profile"
import { absoluteUrl } from "./envelope"

// The Person node every structured-data entry points back to. The Person
// itself is described once, on the home page; other pages reference it by @id.
const PERSON_ID = `${profile.url}/#me`

const SCHEMA_CONTEXT = "https://schema.org"

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

export { PERSON_ID, buildReviewJsonLd }
