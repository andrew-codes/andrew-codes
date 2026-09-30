import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { useLoaderData } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { topicForTag } from "../data/topics"
import { getMdxListItems } from "../libs/mdx.server"
import { buildMeta } from "../libs/meta"
import type { MdxListItem } from "../types"

// The route param is a topic slug: several tags can share one topic (`ai` and
// `agents`), and a tag that is not in the curated topic list has a topic
// derived from its text.
const onlyForTopic = (slug: string) => (posts: MdxListItem[]) =>
  posts.filter((post) => post.frontmatter.tags?.some((tag) => topicForTag(tag).slug === slug))

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const slug = params.id ?? ""
  const posts = await getMdxListItems({ request })
  const postsForTopic = onlyForTopic(slug)(posts)
  const tag = postsForTopic.flatMap((post) => post.frontmatter.tags ?? []).find((candidate) => topicForTag(candidate).slug === slug)

  return {
    topic: { slug, label: tag ? topicForTag(tag).label : slug },
    posts: postsForTopic.sort(
      (a, b) =>
        new Date(b.frontmatter?.date ?? 0).getTime() -
        new Date(a.frontmatter?.date ?? 0).getTime(),
    ),
  }
}

const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const slug = params.id ?? ""
  const label = data?.topic.label ?? slug

  return buildMeta({
    title: `Andrew Smith | Posts tagged ${label}`,
    description: `Posts by Andrew Smith about ${label}: experiences and thoughts on technology and software engineering.`,
    path: `/tags/${encodeURIComponent(slug)}`,
  })
}

const TagsRoute = () => {
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
          Read about my experiences and thoughts on technology and software
          engineering.
        </Typography>
        <CallToAction
          secondaryTitle="View Recommendations"
          secondaryAction="/recommendations?priority=featured"
        />
      </PageHeader>
      <Section>
        <SectionHeader title="Featured" />
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Stack>
      </Section>
    </Stack>
  )
}

export default TagsRoute
export { loader, meta }
