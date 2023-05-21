import type { HeadersFunction, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import styled from "styled-components"
import { Header } from "~/components/Category"
import Link from "~/components/Link"
import PageMeta from "~/components/PageMeta"
import PageWithHeader from "~/components/PageWithHeader"
import { Posts } from "~/components/Post"
import Tags from "~/components/Tags"
import type { Category } from "~/libs/categories"
import { getHash } from "~/libs/hash.server"
import deserializePosts from "~/libs/posts/posts"
import {
  getPartsToHash,
  getPosts,
  toClientPosts,
} from "~/libs/posts/posts.server"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"
import type { Post, PostMetadata } from "~/libs/posts/types"

const onlyForCategory =
  (category: Category) => (posts: Record<string, Post<PostMetadata>>) =>
    Object.fromEntries(
      Object.entries(posts).filter(
        ([_, [__, metadata]]) => metadata?.category == category,
      ),
    )
const loader = async (args: LoaderArgs) => {
  const postsBySlug = await getPosts()
  const postsForCategoryBySlug = onlyForCategory(args.params.id as Category)(
    postsBySlug,
  )

  return json(
    {
      posts: toClientPosts(postsForCategoryBySlug),
    },
    {
      headers: {
        ETag: getHash(getPartsToHash(Object.values(postsForCategoryBySlug))),
      },
    },
  )
}

const headers: HeadersFunction = ({ loaderHeaders }) => ({
  ETag: loaderHeaders.get("ETag"),
})

const Page = styled(PageWithHeader)`
  padding-bottom: 2rem;

  ${Header} {
    margin-bottom: 2rem;
  }
  section > * {
    margin: 0 1rem;
  }

  ${Posts} > li {
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

  ul ${Link} {
    color: rgb(0, 0, 0);
  }
`

const CategoryRoute = () => {
  const { posts } = useLoaderData<typeof loader>()
  const categoryPosts = deserializePosts(Object.entries(posts)).sort(
    sortByMany(newestFirst, alphabetically),
  )
  const { id } = useParams()

  return (
    <>
      <PageMeta title="Home - Andrew Smith" description="" />
      <Page as="article">
        <Header category={id as Category}>
          <h1>{id}</h1>
        </Header>
        <section>
          <Posts>
            {categoryPosts.map(([slug, [_, metadata]]) => (
              <li key={slug}>
                <h3>
                  <Link to={`/posts/${slug}`}>{metadata?.title}</Link>
                </h3>
                {!!metadata?.description && <p>{metadata?.description}</p>}
                {!!metadata?.date && (
                  <time dateTime={metadata.date.toLocaleDateString()}>
                    {metadata.date.toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                {!!metadata?.tags && metadata?.tags.length > 0 && (
                  <Tags tags={metadata.tags} />
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
export { headers, loader }
