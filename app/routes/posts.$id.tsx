import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/node"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import * as styled from "styled-components"
import { Helmet } from "react-helmet"
import { Page } from "~/components/resume"
import { getPostById } from "~/libs/posts/posts.server"

const loader = async (args: LoaderArgs) => {
  const { id } = args.params
  const [code, metadata] = await getPostById(id)

  return json({ code, metadata })
}

const PostRoute = () => {
  const { code, metadata } = useLoaderData<typeof loader>()
  const Component = useMemo(() => getMDXComponent(code, { styled }), [code])

  return (
    <>
      <Helmet>
        <title>{metadata?.title}</title>
        <meta name="description" content={metadata?.description} />
      </Helmet>
      <Page>
        <h1>{metadata?.title}</h1>
        <Component components={{}} />
      </Page>
    </>
  )
}

export default PostRoute
export { loader }
