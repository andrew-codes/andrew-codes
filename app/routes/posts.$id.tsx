import type {
  HeadersFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import * as styled from "styled-components"
import { Header } from "~/components/Category"
import getCodePostAssetComponent from "~/components/CodePostAsset"
import Link from "~/components/Link"
import PageWithHeader from "~/components/PageWithHeader"
import { Blockquote, H2, H3, H4, Paragraph, Table } from "~/components/Post"
import Tags from "~/components/Tags"
import { getHash } from "~/libs/hash.server"
import { getMdxPage, getMdxPages } from "~/libs/mdx.server"
import { getServerTimeHeader } from "~/libs/timing.server"
import { tryFormatDate, useLoaderHeaders } from "~/libs/utils"
import type { Handle } from "~/types"

const handle: Handle = {
  getSitemapEntries: async (request) => {
    const timings = {}
    const pages = await getMdxPages({ request, timings })
    return pages.map((page) => {
      return { route: `/${page.slug}`, priority: 0.6 }
    })
  },
}

const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data.frontmatter?.title ?? "Article"} | Andrew Smith` }]
}

const loader = async ({ params, request }: LoaderArgs) => {
  const { id } = params
  if (!id) {
    throw new Error("Missing id")
  }

  const timings = {}
  const post = await getMdxPage(id, { request, timings })

  return json(post, {
    status: 200,
    headers: {
      "Cache-Control": "private, max-age=3600",
      Vary: "Cookie",
      "Server-Timing": getServerTimeHeader(timings),
      ETag: getHash([post.code, JSON.stringify(post.frontmatter)]),
    },
  })
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const headers: HeadersFunction = useLoaderHeaders()

const Post = styled.default(PageWithHeader)`
@media (max-width: 640px) {
margin: 0;
}

  ${Header} {
    time {
      align-self: end;
      color: rgb(80,80,80);
      font-size: 1.125rem;
      position: absolute;
      right: 1.5rem;
      text-align-last: end;
      bottom: -2rem;
    }
  }

  section {
    padding: 0 1.5rem 1.5rem;

    @media (max-width: 640px) {
    padding: 0 0.75rem;
    }

    ${H2} {
      margin: 1.5rem 0;
    }
    
    ${H3} {
      margin-bottom: 0.5rem;
    }

    ${H4} {
      margin-bottom: 0.5rem;
    }

    > ${Paragraph} {
      margin-bottom: 1.125rem;
    }

    dt {
      font-weight: bold;
    }
  }
`

const PostRoute = () => {
  const { code, frontmatter, codeAssets } = useLoaderData<typeof loader>()
  const Component = useMemo(() => getMDXComponent(code, { styled }), [code])
  const PostCodeAsset = useMemo(
    () => getCodePostAssetComponent(codeAssets),
    [codeAssets],
  )

  return (
    <>
      <Post as="article">
        <Header category={frontmatter.category}>
          <h1>{frontmatter.title}</h1>
          {!!frontmatter.date && (
            <time dateTime={tryFormatDate(frontmatter.date)}>
              {tryFormatDate(frontmatter.date, {
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          {!!frontmatter.tags && frontmatter.tags.length > 0 && (
            <Tags tags={frontmatter.tags} />
          )}
        </Header>
        <section>
          <Component
            components={{
              CodePostAsset: PostCodeAsset,
              a: Link,
              blockquote: Blockquote,
              h2: H2,
              h3: H3,
              h4: H4,
              p: Paragraph,
              table: Table,
            }}
          />
        </section>
      </Post>
    </>
  )
}

export default PostRoute
export { handle, headers, loader, meta }
