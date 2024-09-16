import styled from "@emotion/styled"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { startCase } from "lodash-es"
import { Helmet } from "react-helmet"
import { Header } from "../components/Category"
import Link from "../components/Link"
import PageWithHeader from "../components/PageWithHeader"
import { Posts } from "../components/Post"
import Tags from "../components/Tags"
import { getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import {
  alphabetically,
  newestFirst,
  sortByMany,
} from "../libs/posts/sortPosts"
import { getServerTimeHeader } from "../libs/timing.server"
import { tryFormatDate, useLoaderHeaders } from "../libs/utils"
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

const Page = styled(PageWithHeader)`
  padding-bottom: 2rem;

  header {
    color: rgb(0, 0, 0);
    margin-bottom: 2rem;
  }
  section > * {
    margin: 0 1rem;
  }

  ol > li {
    margin-top: 1.5rem;
    position: relative;

    time {
      position: absolute;
      right: 1rem;
      top: 0;
    }
  }

  h3 {
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  ul a {
    color: rgb(0, 0, 0);
  }
`
const CategoryRoute = () => {
  const { posts } = useLoaderData<typeof loader>()
  const tagPosts = posts.sort(sortByMany(newestFirst, alphabetically))
  const { id } = useParams()

  return (
    <>
      <Helmet>
        <title>{startCase(id)} Tagged Articles | Andrew Smith</title>
      </Helmet>
      <Page as="article">
        <Header category={null}>
          <h1>{id}</h1>
        </Header>
        <section>
          <Posts>
            {tagPosts.map((post) => (
              <li key={post.slug}>
                <h3>
                  <Link to={`/posts/${post.slug}`}>
                    {post.frontmatter.title}
                  </Link>
                </h3>
                {!!post.frontmatter.description && (
                  <p>{post.frontmatter.description}</p>
                )}
                {!!post.frontmatter.date && (
                  <time dateTime={tryFormatDate(post.frontmatter.date)}>
                    {tryFormatDate(post.frontmatter.date, {
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <Tags tags={post.frontmatter.tags} />
                )}
              </li>
            ))}
          </Posts>
        </section>
      </Page>
    </>
  )
}

export default CategoryRoute
export { headers, loader, meta }
