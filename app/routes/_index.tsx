// import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getPosts } from "~/libs/posts/posts.server"
import type { Post } from "~/libs/posts/types.d"
import parsedMetadata from "~/libs/posts/parsedMetadata"
import { alphabetically, newestFirst, sortByMany } from "~/libs/posts/sortPosts"
// import { Link, useLoaderData } from "@remix-run/react"

const loader = async (args: LoaderArgs) => {
  const postsBySlug = await getPosts()

  return json({ posts: postsBySlug })
}

const HomeRoute = () => {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <>
      <h1>Hello</h1>
      <ol>
        {Object.entries(posts)

          .map(
            ([slug, post]) =>
              [slug, [post[0], parsedMetadata(post[1])]] as [string, Post],
          )
          .sort(sortByMany(newestFirst, alphabetically))
          .map(([slug, [content, metadata]]) => (
            <li key={slug}>
              <Link to={`/posts/${slug}`}>{metadata?.title}</Link>
            </li>
          ))}
      </ol>
    </>
  )
}

export default HomeRoute
export { loader }
