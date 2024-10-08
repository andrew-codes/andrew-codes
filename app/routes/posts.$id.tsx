import styled from "@emotion/styled"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import { Helmet } from "react-helmet"
import { Header } from "../components/Category"
import getCodePostAssetComponent from "../components/CodePostAsset"
import PageWithHeader from "../components/PageWithHeader"
import {
  Blockquote,
  H2,
  H3,
  H4,
  Link,
  Paragraph,
  Table,
} from "../components/Post"
import Tags from "../components/Tags"
import { getHash } from "../libs/hash.server"
import { getMdxPage } from "../libs/mdx.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { tryFormatDate, useLoaderHeaders } from "../libs/utils"

const loader = async ({ params, request }: LoaderFunctionArgs) => {
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

const Post = styled(PageWithHeader)`
  header {
    time {
      align-self: end;
      color: rgb(80, 80, 80);
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

    dt {
      font-weight: bold;
      font-family: "Lato-Black", sans-serif;
    }

    strong {
      font-weight: bold;
      font-family: "Lato-Black", sans-serif;
    }

    li {
      margin-bottom: 0.5rem;
    }

    img {
      max-width: 100%;
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
      <Helmet>
        <title>{frontmatter.title ?? "Article"} | Andrew Smith</title>
      </Helmet>
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
export { headers, loader }
