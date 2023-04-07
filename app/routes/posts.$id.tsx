import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/node"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import * as styled from "styled-components"
import { Helmet } from "react-helmet"
import { getPostById } from "~/libs/posts/posts.server"
import Paper from "~/components/Paper"
import Link from "~/components/Link"
import type { Category } from "~/libs/categories"
import { getColor } from "~/libs/categories"
import { Tag, Tags } from "~/components/Tags"
import SmallContentDivider from "~/components/SmallContentDivider"

const loader = async (args: LoaderArgs) => {
  const { id } = args.params
  const [code, metadata] = await getPostById(id)

  return json({ code, metadata })
}

const Header = styled.default.header<{ category: Category }>`
  background: ${({ category }) => getColor(category)};
  color: rgb(255,255,255);
`
const Post = styled.default(Paper)`
  border: none;
  padding: 0;

  ${Header} {
    padding: 1.5rem;
    border-radius: 1rem 1rem 0 0;

    h1 {
      margin: 0;
      padding: 0
    }
  }

  article {
    padding: 0 1.5rem 1.5rem  ;
  }
`

const PostRoute = () => {
  const { code, metadata } = useLoaderData<typeof loader>()
  const Component = useMemo(() => getMDXComponent(code, { styled }), [code])

  return (
    <>
      <Helmet>
        <title>{metadata?.title}</title>
        <meta name="description" content={metadata?.description} />
      </Helmet>
      <Post>
        <Header category={metadata?.category}>
          <h1>{metadata?.title}</h1>
          {!!metadata?.tags && metadata?.tags.length > 0 && (
            <Tags tags={metadata.tags} />
          )}
        </Header>
        <article>
          <Component components={{ a: Link }} />
        </article>
      </Post>
    </>
  )
}

export default PostRoute
export { loader }
