import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { useLoaderData } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { getMdxPages } from "../libs/mdx.server"
import type { MdxPage } from "../types"

const onlyForTag = (tag: string) => (posts: MdxPage[]) =>
  posts.filter((post) => post.frontmatter.tags?.includes(tag))

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const posts = await getMdxPages({ request })
  const postsForTag = onlyForTag(params.id ?? "")(posts)

  return {
    posts: postsForTag.sort(
      (a, b) =>
        new Date(b.frontmatter?.date ?? 0).getTime() -
        new Date(a.frontmatter?.date ?? 0).getTime(),
    ),
  }
}

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Post Tags",
    },
    {
      name: "description",
      content:
        "Read about my experiences and thoughts on technology and software engineering.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Post Tags",
    },
    {
      name: "og:description",
      content:
        "Read about my experiences and thoughts on technology and software engineering.",
    },
  ]
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
