import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { startCase } from "lodash-es"
import { Helmet } from "react-helmet"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"
import type { MdxPage } from "../types"

const onlyForTag = (tag: string) => (posts: MdxPage[]) =>
  posts.filter((post) => post.frontmatter.tags?.includes(tag))

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })
  const postsForTag = onlyForTag(params.id ?? "")(posts)

  return json(
    {
      posts: postsForTag,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
        ETag: getHash(
          postsForTag.flatMap((post) => [
            post.code,
            JSON.stringify(post.frontmatter),
          ]),
        ),
      },
    },
  )
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const headers: HeadersFunction = useLoaderHeaders()

const TagsRoute = () => {
  const { posts } = useLoaderData<typeof loader>()
  const { id } = useParams()

  return (
    <>
      <Helmet>
        <title>{startCase(id)} Tagged Articles | Andrew Smith</title>
      </Helmet>
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
    </>
  )
}

export default TagsRoute
export { headers, loader }
