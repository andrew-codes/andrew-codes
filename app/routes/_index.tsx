import type {
  HeadersFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import styled from "styled-components"
import GenericLink from "~/components/Link"
import Paper from "~/components/Paper"
import { Posts } from "~/components/Post"
import Tags from "~/components/Tags"
import {
  getBackgroundGradient,
  getColors,
  getDescription,
} from "~/libs/categories"
import { getHash, getFilePartsToHash } from "~/libs/hash.server"
import { getMdxPages } from "~/libs/mdx.server"
import postsByCategory from "~/libs/posts/categorize"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"
import { getServerTimeHeader } from "~/libs/timing.server"
import { useLoaderHeaders } from "~/libs/utils"
import type { Category } from "~/types"

const meta: V2_MetaFunction = () => {
  return [{ title: "Andrew Smith | Home" }]
}

const loader = async ({ request, params }: LoaderArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })

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

const Link = styled(GenericLink)``
const Blockquote = styled.blockquote`
  font-size: 1.125rem;
`
const Hero = styled(Paper)`
  padding: 1rem 1.5rem;

  @media (max-width: 600px) {
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

  ${Blockquote} {
    margin-bottom: 0;

    @media (max-width: 600px) {
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

  @media (max-width: 600px) {
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

    :after {
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

  ${Posts} > li {
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

  ${Link} {
    color: rgb(255, 255, 255);
    text-decoration: none;
  }
`

const PostCategories = styled.main`
  display: flex;
  flex-direction: rows;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  @media (max-width: 600px) {
    margin: 0;
  }

  > ${PostCategory} {
    margin: 0.5rem;
    height: 466px;
    position: relative;
    padding-bottom: 3rem;

    @media (max-width: 600px) {
      height: unset !important;
      margin: 0 !important;
    }

    > ${Link} {
      bottom: 1rem;
      display: block;
      position: absolute;
      right: 1rem;
      text-align: right;
    }
  }
  > ${PostCategory}:nth-child(odd) {
    margin-left: 0;
  }
  > ${PostCategory}:nth-child(even) {
    margin-right: 0;
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
      <Hero as="section">
        <h1>Hi, &#x1f44b;!</h1>
        <Blockquote>
          I'm Andrew and I <strong>empower</strong> others through{" "}
          <strong>quality</strong> software.
          <br />
          <br />I aim to make software development more accessible to a wider
          audience. I accomplish this through mentorship,{" "}
          <abbr title="Open source software">OSS</abbr>, and sharing my
          experiences. This site is my professional profile, resume, and some
          learnings over my {yearsOfExperience} year career.
        </Blockquote>
      </Hero>
      <PostCategories>
        {postsByCategory(posts).map(([category, posts]) => (
          <PostCategory as="section" key={category} name={category}>
            <h2>{category}</h2>
            <p>{getDescription(category)}</p>
            <Posts>
              {posts
                .slice(0, 3)
                .sort(sortByMany(newestFirst, alphabetically))
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
export { headers, loader, meta }
