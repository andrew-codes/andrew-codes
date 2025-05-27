import styled from "@emotion/styled"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import getCodePostAssetComponent, {
  CodePostAsset,
} from "../components/CodePostAsset"
import PageWithHeader from "../components/PageWithHeader"
import {
  Blockquote,
  H2,
  H3,
  H4,
  Image,
  Link,
  OrderedList,
  Paragraph,
  Table,
  UnorderedList,
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

const meta: MetaFunction<typeof loader> = (args) => {
  return [
    {
      title: `Andrew Smith | ${args.data?.frontmatter?.title || "Post"}`,
    },
    {
      name: "og:title",
      content: `Andrew Smith | ${args.data?.frontmatter?.title || "Post"}`,
    },
  ]
}

const PostRoute = () => {
  const { code, frontmatter, codeAssets } = useLoaderData<typeof loader>()
  const Component = useMemo(
    () => getMDXComponent(code, { styled: styled }),
    [code],
  )
  const PostCodeAsset = useMemo(
    () => getCodePostAssetComponent(codeAssets),
    [codeAssets],
  )

  return (
    <>
      <Card component="article">
        <Stack direction="column" spacing={4}>
          <Stack component="header" direction="column" spacing={0.25}>
            <Stack direction="row" justifyContent="space-between">
              <Typography level="h2">{frontmatter.title}</Typography>
              {!!frontmatter.date && (
                <time dateTime={tryFormatDate(frontmatter.date)}>
                  {tryFormatDate(frontmatter.date, {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
            </Stack>
            {!!frontmatter.tags && frontmatter.tags.length > 0 && (
              <Tags tags={frontmatter.tags} />
            )}
          </Stack>
          <Box>
            <Component
              components={{
                CodePostAsset: PostCodeAsset,
                a: Link,
                blockquote: Blockquote,
                h2: H2,
                h3: H3,
                img: Image,
                h4: H4,
                p: Paragraph,
                strong: (props) => (
                  <Typography
                    fontWeight={900}
                    sx={(theme) => ({
                      color: theme.palette.neutral.plainColor,
                    })}
                    {...props}
                  />
                ),
                ul: (props) => <UnorderedList root {...props} />,
                ol: (props) => <OrderedList root {...props} />,
                table: Table,
                pre: (props: any) => {
                  if (props.children.type === "code") {
                    return (
                      <CodePostAsset
                        language={props.children.props.className}
                        code={props.children.props.children}
                      />
                    )
                  }

                  return <pre {...props} />
                },
              }}
            />
          </Box>
        </Stack>
      </Card>
    </>
  )
}

export default PostRoute
export { headers, loader, meta }
