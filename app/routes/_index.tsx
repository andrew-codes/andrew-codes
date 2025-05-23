import Button from "@mui/joy/Button"
import Divider from "@mui/joy/Divider"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  MetaFunction,
  Link as RemixLink,
  useLoaderData,
} from "@remix-run/react"
import { fileURLToPath } from "url"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { getFilePartsToHash, getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"
import { featured } from "../recommendations"

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings = {}
  const posts = (await getMdxPages({ request, timings })).sort(
    (a, b) =>
      new Date(b.frontmatter?.date ?? 0).getTime() -
      new Date(a.frontmatter?.date ?? 0).getTime(),
  )

  let featuredPosts = posts
    .filter((post) => post.frontmatter.tags?.includes("featured"))
    .slice(0, 3)
  if (featuredPosts.length < 3) {
    featuredPosts = featuredPosts.concat(
      posts
        .filter((post) => !post.frontmatter.tags?.includes("featured"))
        .slice(0, 3 - featuredPosts.length),
    )
  }

  const __filename = fileURLToPath(import.meta.url)
  const selfFilePartsToHash = await getFilePartsToHash(__filename)

  return json(
    { posts: featuredPosts },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
        ETag: getHash(
          posts
            .flatMap((post) => [post.code, JSON.stringify(post.frontmatter)])
            .concat([selfFilePartsToHash]),
        ),
      },
    },
  )
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const headers: HeadersFunction = useLoaderHeaders()

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
        <SectionHeader title="Featured Posts">
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
export { headers, loader, meta }
