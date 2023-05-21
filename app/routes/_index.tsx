import type { HeadersFunction, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import styled from "styled-components"
import Link from "~/components/Link"
import PageMeta from "~/components/PageMeta"
import Paper from "~/components/Paper"
import { Posts } from "~/components/Post"
import Tags from "~/components/Tags"
import type { Category } from "~/libs/categories"
import { getColor, getDescription } from "~/libs/categories"
import { getHash, getFilePartsToHash } from "~/libs/hash.server"
import postsByCategory from "~/libs/posts/categorize"
import deserializePosts from "~/libs/posts/posts"
import {
  getPartsToHash,
  getPosts,
  toClientPosts,
} from "~/libs/posts/posts.server"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"

const loader = async (args: LoaderArgs) => {
  const postsBySlug = await getPosts()

  const selfHash = await getFilePartsToHash(__filename)
  console.log(
    getHash(getPartsToHash(Object.values(postsBySlug)).concat(selfHash)),
  )

  return json(
    { posts: toClientPosts(postsBySlug) },
    {
      headers: {
        ETag: getHash(
          getPartsToHash(Object.values(postsBySlug)).concat(selfHash),
        ),
      },
    },
  )
}

const headers: HeadersFunction = ({ loaderHeaders }) => ({
  ETag: loaderHeaders.get("ETag"),
})

const Blockquote = styled.blockquote`
  font-size: 1.125rem;
`
const Hero = styled(Paper)`
  padding: 1rem 1.5rem;

  h1 {
    margin-top: 0;
  }

  ${Blockquote} {
    margin-bottom: 0;
  }
`

const PostCategory = styled(Paper)<{ name: Category }>`
  background: ${({ name }) => {
    return getColor(name)
  }};
  border: none;
  color: rgb(255, 255, 255) !important;
  min-height: 370px;
  padding: 1rem 1.25rem;
  width: calc(50% - 0.5rem);

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

  > ${PostCategory} {
    margin: 0.5rem;
    height: 466px;
    position: relative;
    padding-bottom: 3rem;

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
      <PageMeta title="Home - Andrew Smith" description="" />
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
        {postsByCategory(deserializePosts(Object.entries(posts))).map(
          ([category, posts]) => (
            <PostCategory as="section" key={category} name={category}>
              <h2>{category}</h2>
              <p>{getDescription(category)}</p>
              <Posts>
                {posts
                  .slice(0, 3)
                  .sort(sortByMany(newestFirst, alphabetically))
                  .map(([slug, [_, metadata]]) => (
                    <li key={slug}>
                      <h3>
                        <Link to={`/posts/${slug}`}>{metadata?.title}</Link>
                      </h3>
                      {metadata?.description && <p>{metadata?.description}</p>}
                      {!!metadata?.tags && metadata?.tags.length > 0 && (
                        <Tags tags={metadata.tags} />
                      )}
                    </li>
                  ))}
              </Posts>
              <Link to={`category/${category}`}>See more...</Link>
            </PostCategory>
          ),
        )}
      </PostCategories>
    </>
  )
}

export default HomeRoute
export { headers, loader }
