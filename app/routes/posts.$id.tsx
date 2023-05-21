import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getMDXComponent } from "mdx-bundler/client"
import path from "path"
import { useMemo } from "react"
import * as styled from "styled-components"
import { Header } from "~/components/Category"
import getCodePostAssetComponent from "~/components/CodePostAsset"
import Link from "~/components/Link"
import PageMeta from "~/components/PageMeta"
import PageWithHeader from "~/components/PageWithHeader"
import { Blockquote, H2, H3, H4, Paragraph, Table } from "~/components/Post"
import Tags from "~/components/Tags"
import { directoryPath, fileName, readDirFiles } from "~/libs/fs.server"
import parsedMetadata from "~/libs/posts/parsedMetadata"
import { getHash, getPostById } from "~/libs/posts/posts.server"

const loader = async (args: LoaderArgs) => {
  const { id } = args.params
  const post = await getPostById(id)
  const [code, metadata, { filePath }] = post

  let codeAssets = {}
  try {
    const assetsFiles = await readDirFiles(
      path.join(directoryPath(filePath), "assets"),
    )
    codeAssets = assetsFiles
      .filter(([assetFilePath]) => /.*\.code\.*/.test(assetFilePath))
      .reduce(
        (acc, [assetFilePath, assetFileContent]) => ({
          ...acc,
          [fileName(assetFilePath)]: assetFileContent,
        }),
        {},
      )
  } catch (error) {}

  return json(
    { code, metadata, codeAssets },
    { headers: { ETag: getHash([post]) } },
  )
}

const Post = styled.default(PageWithHeader)`
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
  const {
    code,
    metadata: rawMetadata,
    codeAssets,
  } = useLoaderData<typeof loader>()
  const Component = useMemo(() => getMDXComponent(code, { styled }), [code])
  const metadata = parsedMetadata(rawMetadata)
  const PostCodeAsset = useMemo(
    () => getCodePostAssetComponent(codeAssets),
    [codeAssets],
  )

  return (
    <>
      <PageMeta title={metadata?.title} description={metadata?.description} />
      <Post as="article">
        <Header category={metadata?.category}>
          <h1>{metadata?.title}</h1>
          {!!metadata?.date && (
            <time dateTime={metadata.date.toLocaleString()}>
              {metadata.date.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
          {!!metadata?.tags && metadata?.tags.length > 0 && (
            <Tags tags={metadata.tags} />
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
export { loader }
