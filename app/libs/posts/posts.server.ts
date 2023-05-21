import sha1 from "sha1"
import { readDir } from "../fs.server"
import fs from "fs/promises"
import mdx from "../mdx.server"
import { merge } from "lodash"
import parsedMetadata from "./parsedMetadata"
import type { ClientPost, Post, PostMetadata } from "./types"

const getPosts = async (): Promise<Record<string, Post<PostMetadata>>> => {
  const filesPathsInPostsDirectory = await readDir("app/posts")
  const postFilePaths = filesPathsInPostsDirectory.filter((filePath) =>
    /^.*\.mdx?$/.test(filePath),
  )

  let posts = {}
  for (let filePath of postFilePaths) {
    const source = await fs.readFile(filePath, "utf8")
    if (!source) {
      continue
    }

    const postStat = await fs.stat(filePath)

    const [code, metadata] = (await mdx(source)) as [
      string,
      Record<string, any>,
    ]

    if (!metadata?.slug) {
      continue
    }

    posts = merge({}, posts, {
      [metadata.slug]: [
        code.toString(),
        parsedMetadata(metadata),
        { filePath, modified: postStat.mtime, source },
      ],
    })
  }

  return posts
}

const getHash = (posts: Post<PostMetadata>[]): string => {
  const dataToCalculateHash = posts
    .map(([_, __, fileMetadata]) => fileMetadata.source)
    .join("")
  return sha1(dataToCalculateHash)
}

const getPostById = async (
  id: string | null | undefined,
): Promise<Post<PostMetadata>> => {
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

const toClientPost = (post: Post<PostMetadata>): ClientPost => {
  return [post[0], post[1]]
}

const toClientPosts = (
  posts: Record<string, Post<PostMetadata>>,
): Record<string, ClientPost> => {
  return Object.fromEntries(
    Object.entries(posts).map(([id, post]) => [id, toClientPost(post)]),
  )
}

export { getHash, getPosts, getPostById, toClientPost, toClientPosts }
