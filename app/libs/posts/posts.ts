import parsedMetadata from "./parsedMetadata"
import type { Post } from "./types"

const getPosts = (posts: [string, Post][]) =>
  posts.map(
    ([slug, post]) =>
      [slug, [post[0], parsedMetadata(post[1])]] as [string, Post],
  )

export default getPosts
