import type { Category } from "../categories"
import { getCategories } from "../categories"
import type { Post, PostMetadata } from "./types"

const postsByCategory = (
  posts: [string, Post<PostMetadata>][],
): [Category, [string, Post<PostMetadata>][]][] => {
  return getCategories().map((category) => [
    category,
    posts.filter(([_, post]) => post[1]?.category === category),
  ])
}

export default postsByCategory
