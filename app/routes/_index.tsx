// import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getPosts } from "~/libs/posts/posts.server"
import getClientPosts from "~/libs/posts/posts"
import type { Post } from "~/libs/posts/types.d"
import { flow } from "lodash"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"
import PageMeta from "~/components/PageMeta"
import Paper from "~/components/Paper"
import postsByCategory from "~/libs/posts/categorize"
import styled from "styled-components"
import { getDescription, getColor } from "~/libs/categories"
import type { Category } from "~/libs/categories"
import Link from "~/components/Link"
import SmallContentDivider from "~/components/SmallContentDivider"
import { Tag, Tags } from "~/components/Tags"

const categorizedPosts = flow(getClientPosts, postsByCategory)

const loader = async (args: LoaderArgs) => {
  const postsBySlug = await getPosts()

  return json({ posts: postsBySlug })
}

const Posts = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`

const PostCategory = styled(Paper)<{ name: Category }>`
  background: ${({ name }) => {
    return getColor(name)
  }};
  border: none;
  color: rgb(255, 255, 255) !important;
  min-height: 370px;
  padding: 1rem 1.25rem;
  width: calc(50% - 1rem);

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

  > ${PostCategory} {
    margin: 1rem;
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

  return (
    <>
      <PageMeta title="Home - Andrew Smith" description="" />
      <Paper as="header">
        <h1>Hi, &#x1f44b;!</h1>
      </Paper>
      <PostCategories>
        {categorizedPosts(Object.entries(posts as Record<string, Post>)).map(
          ([category, posts]) => (
            <PostCategory as="section" key={category} name={category}>
              <h2>{category}</h2>
              <p>{getDescription(category)}</p>
              <Posts>
                {posts
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
            </PostCategory>
          ),
        )}
      </PostCategories>
    </>
  )
}

export default HomeRoute
export { loader }
