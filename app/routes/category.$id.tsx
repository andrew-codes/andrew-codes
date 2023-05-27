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
import { getHash } from "~/libs/hash.server"
import { getMdxPages } from "~/libs/mdx.server"
import { tryFormatDate, useLoaderHeaders } from "~/libs/utils"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"
import type { Category, Handle, MdxPage } from "~/types"
import { getCategories } from "~/libs/categories"
import { getServerTimeHeader } from "~/libs/timing.server"

const handle: Handle = {
  getSitemapEntries: async () => {
    return getCategories().map((category) => {
      return { route: `/${category}`, priority: 0.2 }
    })
  },
}

const onlyForCategory = (category: Category) => (posts: MdxPage[]) =>
  posts.filter((post) => post.frontmatter.category == category)

const loader = async ({ request, params }: LoaderArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })
  const postsForCategory = onlyForCategory(params.id as Category)(posts)

  return json(
    {
      posts: postsForCategory,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
        ETag: getHash(
          postsForCategory.flatMap((post) => [
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
  const categoryPosts = posts.sort(sortByMany(newestFirst, alphabetically))
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
            {categoryPosts.map((post) => (
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
                {!!post.frontmatter.tags &&
                  post.frontmatter.tags.length > 0 && (
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
export { handle, headers, loader }
