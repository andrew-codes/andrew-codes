import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { MetaFunction, useLocation } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import RecommendationCard from "../components/RecommendationCard"
import { Section, SectionHeader } from "../components/Section"
import { featuredRecommendations, otherRecommendations, recommendations } from "../data/recommendations"
import { buildReviewJsonLd } from "../libs/agent/structured-data"
import { buildMeta } from "../libs/meta"

const meta: MetaFunction = () => [
  ...buildMeta({
    title: "Andrew Smith | Recommendations",
    description: "Recommendations from my peers, managers, and leaders in the industry.",
    path: "/recommendations",
  }),
  { "script:ld+json": buildReviewJsonLd(recommendations) },
]

const RecommendationsRoute = () => {
  const location = useLocation()
  const prioritizeFeatured = new URLSearchParams(location.search).get("priority") === "featured"

  const displayed = prioritizeFeatured ? [...featuredRecommendations, ...otherRecommendations] : [...otherRecommendations, ...featuredRecommendations]

  return (
    <Stack direction="column" spacing={4}>
      <PageHeader>
        <Typography
          level="body-md"
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              fontSize: "1.5rem",
            },
          })}
        >
          Here’s what my peers, managers, and leaders have to say about me.
        </Typography>
        <CallToAction secondaryTitle="Read my Posts" secondaryAction="/posts" />
      </PageHeader>
      <Section>
        <SectionHeader title="Recommendations" />
        <Stack direction="column" spacing={2}>
          {displayed.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </Stack>
      </Section>
    </Stack>
  )
}

export default RecommendationsRoute
export { meta }
