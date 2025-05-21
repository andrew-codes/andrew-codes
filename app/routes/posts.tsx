import Box from "@mui/joy/Box"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { fileURLToPath } from "url"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { getFilePartsToHash, getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })

  const __filename = fileURLToPath(import.meta.url)
  const selfFilePartsToHash = await getFilePartsToHash(__filename)

  return json(
    {
      posts: posts.sort(
        (a, b) =>
          new Date(b.frontmatter?.date ?? 0).getTime() -
          new Date(a.frontmatter?.date ?? 0).getTime(),
      ),
    },
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
      title: "Andrew Smith | Posts",
    },
    {
      name: "description",
      content:
        "Professional profile of Andrew Smith. Read articles written on technology and software engineering.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Staff Software Engineer",
    },
    {
      name: "og:description",
      content:
        "Professional profile of Andrew Smith. Read articles written on technology and software engineering.",
    },
  ]
}

const PostsRoute = () => {
  const { posts } = useLoaderData<typeof loader>()
  const location = useLocation()
  const isPostPage = /.*\/posts\/.+$/.test(location.pathname)

  return (
    <>
      <PageHeader>
        <CallToAction />
        <Typography level="body-sm" sx={{ marginTop: 2 }}>
          View articles I've written on technology and software engineering.
        </Typography>
      </PageHeader>

      {!isPostPage && (
        <>
          <Box component="section">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                marginBottom: 2,
              }}
            >
              <Typography level="h2" fontSize="xl2" fontWeight={700}>
                Featured
              </Typography>
            </Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={2}
              justifyContent="space-between"
            >
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </Stack>
          </Box>
          <Box component="section">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                marginBottom: 2,
              }}
            >
              <Typography level="h2" fontSize="xl2" fontWeight={700}>
                All
              </Typography>
            </Box>
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
          </Box>
        </>
      )}
      <Outlet />
    </>
  )
}

export default PostsRoute
export { headers, loader, meta }
