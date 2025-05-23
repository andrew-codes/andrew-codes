import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction } from "@remix-run/node"
import { MetaFunction, useLocation } from "@remix-run/react"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import { Section, SectionHeader } from "../components/Section"
import { useLoaderHeaders } from "../libs/utils"
import { featured, nonFeatured } from "../recommendations"

const headers: HeadersFunction = useLoaderHeaders()

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Home",
    },
    {
      name: "description",
      content:
        "Recommendations from my peers, managers, and leaders in the industry.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Staff Software Engineer",
    },
    {
      name: "og:description",
      content:
        "Recommendations from my peers, managers, and leaders in the industry.",
    },
  ]
}

const RecommendationsRoute = () => {
  const location = useLocation()
  const prioritizeFeatured =
    new URLSearchParams(location.search).get("priority") === "featured"

  let recommendations = nonFeatured
  if (prioritizeFeatured) {
    recommendations = featured.concat(nonFeatured)
  } else {
    recommendations = nonFeatured.concat(featured)
  }

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
          Here's what my peers, managers, and leaders have to say about me.
        </Typography>
        <CallToAction secondaryTitle="Read my Posts" secondaryAction="/posts" />
      </PageHeader>
      <Section>
        <SectionHeader title="Recommendations" />
        <Stack direction="column" spacing={2}>
          {recommendations.map((Recommendation, index) => (
            <Recommendation key={index} />
          ))}
        </Stack>
      </Section>
    </Stack>
  )
}

export default RecommendationsRoute
export { headers, meta }
