import Box from "@mui/joy/Box"
import Divider from "@mui/joy/Divider"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { Outlet, useLoaderData, useLocation } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import { Section, SectionHeader } from "../components/Section"
import { getMdxPages } from "../libs/mdx.server"

const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await getMdxPages({ request })

  return {
    posts: posts.sort(
      (a, b) =>
        new Date(b.frontmatter?.date ?? 0).getTime() -
        new Date(a.frontmatter?.date ?? 0).getTime(),
    ),
  }
}

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
          {...(isPostPage && {
            tertiaryTitle: "Read My Posts",
            tertiaryAction: "/posts",
          })}
        />
      </PageHeader>

      {!isPostPage && (
        <>
          <Section>
            <SectionHeader title="Featured" />
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={2}
              justifyContent="space-between"
            >
              {posts
                .filter((post) => post.frontmatter.tags?.includes("featured"))
                .slice(0, 3)
                .map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
            </Stack>
          </Section>
          <Divider />
          <Section>
            <SectionHeader title="All" />
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
        </>
      )}
      <Box>
        <Outlet />
      </Box>
    </Stack>
  )
}

export default PostsRoute
export { loader, meta }
