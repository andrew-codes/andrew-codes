import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { getMDXComponent } from "mdx-bundler/client"
import path from "path"
import { useMemo } from "react"
import mdx from "../libs/mdx.server"
import * as styled from "styled-components"

const loader = async (args: LoaderArgs) => {
  const fs = require("fs/promises")
  const { id } = args.params
  const post = await fs.readFile(
    path.join(__dirname, "..", "app", "posts", `${id}.mdx`),
    "utf8",
  )
  const [code, metadata] = await mdx(post)

  return json({ code: code.toString(), metadata })
}

const PostRoute = () => {
  const { code, metadata } = useLoaderData<typeof loader>()
  const Component = useMemo(() => getMDXComponent(code, { styled }), [code])

  return (
    <>
      <Component />
    </>
  )
}

export default PostRoute
export { loader }
