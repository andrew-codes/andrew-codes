import type { Category, MdxPage } from "~/types"
import { getCategories } from "../categories"

const postsByCategory = (posts: MdxPage[]): [Category, MdxPage[]][] => {
  return getCategories().map((category) => [
    category,
    posts.filter((post) => post.frontmatter.category === category),
  ])
}

export default postsByCategory
