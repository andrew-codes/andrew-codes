import { readDir } from "../fs.server"
import fs from "fs/promises"
import mdx from "../mdx.server"
import { merge } from "lodash"
import parsedMetadata from "./parsedMetadata"
import type { Post } from "./types"

const getPosts = async (): Promise<Record<string, Post>> => {
  const filesPathsInPostsDirectory = await readDir("app/posts")
  const postFilePaths = filesPathsInPostsDirectory.filter((filePath) => /^.*\.mdx?$/.test(filePath))

  let posts = {}
  for (let filePath of postFilePaths) {
    const content = await fs.readFile(filePath, "utf8")
    if (!content) {
      continue
    }

    const [code, metadata] = (await mdx(content)) as [
      string,
      Record<string, any>,
    ]

    if (!metadata?.slug) {
      continue
    }

    posts = merge({}, posts, {
      [metadata.slug]: [code.toString(), parsedMetadata(metadata), filePath],
    })
  }

  return posts
}

const getPostById = async (id: string | null | undefined): Promise<Post> => {
  if (!id) {
    throw new Error("No id supplied")
  }

  const posts = await getPosts()

  const output = posts[id] ?? null
  if (output === null) {
    throw new Error(`No post found for ID: ${id}`)
  }

  return output
}

export { getPosts, getPostById }
