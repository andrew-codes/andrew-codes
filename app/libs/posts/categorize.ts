import type { Category } from "../categories"
import { getCategories } from "../categories"
import type { Post } from "./types"

const postsByCategory = (
  posts: [string, Post][],
): [Category, [string, Post][]][] => {
  return getCategories().map((category) => [
    category,
    posts.filter(([_, post]) => post[1]?.category === category),
  ])
}

export default postsByCategory