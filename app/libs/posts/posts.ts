import parsedMetadata from "./parsedMetadata"
import type { ClientPost } from "./types"

const deserializePosts = (
  posts: [string, ClientPost][],
): [string, ClientPost][] =>
  posts.map(([slug, post]) => [slug, [post[0], parsedMetadata(post[1])]])

export default deserializePosts
