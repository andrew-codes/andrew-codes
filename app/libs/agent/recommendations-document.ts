import type { Recommendation } from "../../data/recommendations"
import { absoluteUrl, buildEnvelope } from "./envelope"

// The /agent/recommendations.json document. Public fields only: name, title,
// employer and photo of each author, plus the recommendation text. `facets`
// is an inverted index (company slug -> recommendation ids) so an agent can
// filter without scanning every record.

const RECOMMENDATIONS_PATH = "/agent/recommendations.json"

const buildRecommendationsDocument = (recommendations: readonly Recommendation[], now?: Date) => {
  const facetsByCompany: Record<string, string[]> = {}
  for (const { id, author } of recommendations) {
    ;(facetsByCompany[author.company.slug] ??= []).push(id)
  }

  return buildEnvelope({
    path: RECOMMENDATIONS_PATH,
    now,
    data: {
      recommendations: recommendations.map(({ id, author, featured, paragraphs }) => ({
        id,
        url: absoluteUrl(`/recommendations#${id}`),
        featured,
        author: { name: author.name, title: author.title, company: { slug: author.company.slug, name: author.company.name }, image: absoluteUrl(author.image) },
        paragraphs,
      })),
      facets: { company: facetsByCompany },
    },
  })
}

export { RECOMMENDATIONS_PATH, buildRecommendationsDocument }
