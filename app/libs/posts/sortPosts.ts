import { flow, partialRight, sortBy } from "lodash-es"
import type { MdxPage } from "../../types"

type PostSort = (a: MdxPage, b: MdxPage) => 0 | 1 | -1

const newestFirst: PostSort = (a, b) => {
  const aTime = new Date(a?.frontmatter?.date ?? 0).getTime()
  const bTime = new Date(b?.frontmatter?.date ?? 0).getTime()

  if (aTime > bTime) {
    return -1
  }
  if (bTime > aTime) {
    return 1
  }

  return 0
}

const alphabetically: PostSort = (a, b) => {
  const aTitle = a?.frontmatter?.title ?? ""
  const bTitle = b?.frontmatter?.title ?? ""
  if (aTitle > bTitle) {
    return 1
  }
  if (bTitle > aTitle) {
    return -1
  }

  return 0
}

const order = flow(
  partialRight(sortBy, (post: MdxPage) => post.frontmatter.title),
  partialRight(sortBy, (post: MdxPage) => new Date(post.frontmatter.date ?? "").getTime() * -1),
) as (posts: MdxPage[]) => MdxPage[]

export { alphabetically, newestFirst, order }
