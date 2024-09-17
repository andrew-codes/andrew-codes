import styled from "@emotion/styled"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { Helmet } from "react-helmet"
import { fileURLToPath } from "url"
import Paper from "../components/Paper"
import { Posts } from "../components/Post"
import Tags from "../components/Tags"
import {
  getBackgroundGradient,
  getColors,
  getDescription,
} from "../libs/categories"
import { getFilePartsToHash, getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import postsByCategory from "../libs/posts/categorize"
import { order } from "../libs/posts/sortPosts"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"
import type { Category } from "../types"

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })

  const __filename = fileURLToPath(import.meta.url)
  const selfFilePartsToHash = await getFilePartsToHash(__filename)

  return json(
    { posts: posts },
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

const Blockquote = styled.blockquote`
  font-size: 1.125rem;
`
const Hero = styled(Paper)`
  padding: 1rem 1.5rem;

  @media (max-width: 640px) {
    border-radius: 1rem 1rem 0 0;
    margin: 0;
    position: relative;

    ::after {
      background-color: rgb(255, 255, 255);
      bottom: -1rem;
      content: "";
      height: 1rem;
      left: 0;
      position: absolute;
      right: 0;
      z-index: 1;
    }
  }

  h1 {
    margin-top: 0;
  }

  blockquote {
    margin-bottom: 0;

    @media (max-width: 640px) {
      margin: 0 0.5rem;
    }
  }
`

const PostCategory = styled(Paper)<{ name: Category }>`
  background: ${({ name }) => {
    return getBackgroundGradient(name)
  }};
  border: none;
  color: rgb(255, 255, 255) !important;
  min-height: 370px;
  padding: 1rem 1.25rem;
  width: calc(50% - 0.5rem);

  @media (max-width: 640px) {
    border-radius: 1rem 1rem 0 0;
    margin: 0;
    min-height: unset !important;
    position: relative;
    width: 100%;
    z-index: 2;

    ::after {
      background-color: ${({ name }) => getColors(name)[0]};
      bottom: -1rem;
      content: "";
      height: 1rem;
      left: 0;
      position: absolute;
      right: 0;
      z-index: 1;
    }
  }

  h2 {
    font-size: 1.75rem;
    font-variant: small-caps;
    line-height: 2rem;
    margin: 0;

    &::after {
      content: "";
      display: block;
      margin: 0.5rem 0;
      background-color: rgb(249, 251, 253);
      height: 1px;
    }
  }

  > p {
    margin-bottom: 2rem;
    min-height: 2.5rem;
  }

  ol > li {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;

    :first-child {
      margin-top: 0;
    }

    p {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  h3 {
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  a {
    color: rgb(255, 255, 255);
  }
`

const PostCategories = styled.main`
  display: flex;
  flex-direction: rows;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  @media (max-width: 640px) {
    margin: 0;
  }

  > section {
    margin: 0.5rem;
    height: 466px;
    position: relative;
    padding-bottom: 3rem;

    @media (max-width: 640px) {
      height: unset !important;
      margin: 0 !important;
    }

    &:nth-child(odd) {
      margin-left: 0;
    }
    &:nth-child(even) {
      margin-right: 0;
    }

    > a {
      bottom: 1rem;
      display: block;
      position: absolute;
      right: 1rem;
      text-align: right;
    }
  }
`

const HomeRoute = () => {
  const { posts } = useLoaderData<typeof loader>()

  const today = new Date()
  const yearsOfExperience =
    new Date(today.getTime() - new Date(2008, 1, 1).getTime()).getFullYear() -
    1970

  return (
    <>
      <Helmet>
        <title>Home | Andrew Smith</title>
      </Helmet>
      <Hero as="section">
        <h1>Hi, &#x1f44b;!</h1>
        <Blockquote>
          <span>I'm Andrew and I </span>
          <strong>empower</strong>
          <span> others through </span>
          <strong>quality</strong> software.
          <br />
          <br />
          <span>
            I aim to make software development more accessible to a wider
            audience. I accomplish this through mentorship,
          </span>{" "}
          <abbr title="Open source software">OSS</abbr>
          <span>
            , and sharing my experiences. This site is my professional profile,
            resume, and some learnings over my
          </span>{" "}
          <span>{yearsOfExperience}</span> <span>year career.</span>
        </Blockquote>
      </Hero>
      <PostCategories>
        {postsByCategory(posts).map(([category, posts]) => (
          <PostCategory as="section" key={category} name={category}>
            <h2>{category}</h2>
            <p>{getDescription(category)}</p>
            <Posts>
              {order(posts)
                .slice(0, 3)
                .map((post) => (
                  <li key={post.slug}>
                    <h3>
                      <Link to={`/posts/${post.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    {post.frontmatter.description && (
                      <p>{post.frontmatter.description}</p>
                    )}
                    {!!post.frontmatter.tags &&
                      post.frontmatter.tags.length > 0 && (
                        <Tags tags={post.frontmatter.tags} />
                      )}
                  </li>
                ))}
            </Posts>
            <Link to={`/category/${category}`}>See more...</Link>
          </PostCategory>
        ))}
      </PostCategories>
    </>
  )
}

export default HomeRoute
export { headers, loader }
