import styled from "@emotion/styled"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import Divider from "@mui/joy/Divider"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { useLoaderData } from "react-router"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import getCodePostAssetComponent, { CodePostAsset } from "../components/CodePostAsset"
import { Blockquote, CollapsibleSection, H2, H3, H4, Image, Link, OrderedList, Paragraph, Table, UnorderedList } from "../components/Post"
import Tags from "../components/Tags"
import { getMdxPage } from "../libs/mdx.server"
import { markdownPaths } from "../libs/agent/markdown-paths"
import { buildMeta } from "../libs/meta"
import { toIsoDate, tryFormatDate } from "../libs/utils"

const DEFAULT_POST_DESCRIPTION = "An article by Andrew Smith on technology and software engineering."

const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params
  if (!id) {
    throw new Error("Missing id")
  }

  const post = await getMdxPage(id, { request })

  return post
}

const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const frontmatter = data?.frontmatter
  const title = `Andrew Smith | ${frontmatter?.title || "Post"}`

  return buildMeta({
    title,
    description: frontmatter?.description || DEFAULT_POST_DESCRIPTION,
    path: `/posts/${encodeURIComponent(data?.slug ?? params.id ?? "")}`,
    markdownPath: markdownPaths.post(encodeURIComponent(data?.slug ?? params.id ?? "")),
    type: "article",
    article: {
      publishedTime: toIsoDate(frontmatter?.date),
      tags: frontmatter?.tags,
      section: frontmatter?.category,
    },
  })
}

const PostRoute = () => {
  const { code, frontmatter, codeAssets, readTime } = useLoaderData<typeof loader>()
  // Intentional: mdx-bundler's documented pattern for rendering compiled MDX
  // is to build the component from the bundled `code` string via useMemo, so
  // identity only changes when the post's compiled code changes.
  const Component = useMemo(() => getMDXComponent(code, { styled: styled }), [code])
  const PostCodeAsset = useMemo(() => getCodePostAssetComponent(codeAssets), [codeAssets])

  return (
    <Box sx={{ width: "100%" }}>
      <Divider sx={{ mb: 2 }} />
      <Card
        component="article"
        variant="plain"
        sx={{
          background: "none",
          width: "min(760px, 100%)",
          margin: "0 auto",
          padding: 0,
        }}
      >
        <Stack direction="column" spacing={2}>
          <Stack component="header" direction="column" spacing={0.25} sx={{ marginTop: "1.5rem" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography level="h2">{frontmatter.title}</Typography>
              <Stack direction="column" alignItems="flex-end" spacing={0.25}>
                {!!frontmatter.date && (
                  <time dateTime={toIsoDate(frontmatter.date)}>
                    {tryFormatDate(frontmatter.date, {
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                {!!readTime && (
                  <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                    {readTime.text}
                  </Typography>
                )}
              </Stack>
            </Stack>
            {!!frontmatter.tags && frontmatter.tags.length > 0 && <Tags tags={frontmatter.tags} />}
          </Stack>
          <Divider />
          <Box sx={{ maxWidth: "760px", margin: "0 auto", "& > *:first-child": { marginTop: 0 } }}>
            {/* eslint-disable-next-line react-hooks/static-components -- memoized on [code], see definition above */}
            <Component
              components={{
                CodePostAsset: PostCodeAsset,
                CollapsibleSection,
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
                    return <CodePostAsset language={props.children.props.className} code={props.children.props.children} />
                  }

                  return <pre {...props} />
                },
              }}
            />
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}

export default PostRoute
export { loader, meta }
