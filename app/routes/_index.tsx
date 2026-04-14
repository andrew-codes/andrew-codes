import Button from "@mui/joy/Button"
import Divider from "@mui/joy/Divider"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "react-router"
import { Link as RemixLink, useLoaderData } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { getMdxPages } from "../libs/mdx.server"
import { featured } from "../recommendations"

const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = (await getMdxPages({ request })).sort(
    (a, b) =>
      new Date(b.frontmatter?.date ?? 0).getTime() -
      new Date(a.frontmatter?.date ?? 0).getTime(),
  )

  return { posts: posts.slice(0, 3) }
}

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Home",
    },
    {
      name: "description",
      content:
        "Professional profile of Andrew Smith. View my resume, recommendations, and featured posts.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Staff Software Engineer",
    },
    {
      name: "og:description",
      content:
        "Professional profile of Andrew Smith. View my resume, recommendations, and featured posts.",
    },
  ]
}

const HomeRoute = () => {
  const { posts } = useLoaderData<typeof loader>()

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
          I create robust, scalable applications and drive engineering teams.
        </Typography>
        <CallToAction
          secondaryTitle="View Recommendations"
          secondaryAction="/recommendations?priority=featured"
          tertiaryTitle="Read my Posts"
          tertiaryAction="/posts"
        />
      </PageHeader>
      <Section>
        <SectionHeader title="Recommendations">
          <Button
            variant="plain"
            component={RemixLink}
            to="/recommendations"
            size="sm"
            sx={(theme) => ({
              height: "1rem",
            })}
          >
            View All
          </Button>
        </SectionHeader>
        <Stack direction="column" spacing={2}>
          {featured.map((Recommendation, index) => (
            <Recommendation key={index} />
          ))}
        </Stack>
      </Section>
      <Divider />
      <Section>
        <SectionHeader title="Latest Posts">
          <Button
            variant="plain"
            component={RemixLink}
            to="/posts"
            size="sm"
            sx={(theme) => ({
              height: "1rem",
            })}
          >
            View All
          </Button>
        </SectionHeader>
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Stack>
      </Section>
    </Stack>
  )
}

export default HomeRoute
export { loader, meta }
