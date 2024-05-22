import type { MdxPage } from "~/types"

type PostSort = (a: MdxPage, b: MdxPage) => 0 | 1 | -1

const newestFirst: PostSort = (a, b) => {
  const aDate = new Date(a.frontmatter?.date ?? 0)
  const bDate = new Date(b.frontmatter?.date ?? 0)

  if (aDate.getTime() ?? 0 > (bDate.getTime() ?? 0)) {
    return -1
  }
  if (bDate.getTime() ?? 0 > (aDate.getTime() ?? 0)) {
    return 1
  }

  return 0
}

const alphabetically: PostSort = (a, b) => {
  const aTitle = a.frontmatter?.title ?? ""
  const bTitle = b.frontmatter?.title ?? ""
  if (aTitle > bTitle) {
    return 1
  }
  if (bTitle > aTitle) {
    return -1
  }

  return 0
}

const sortByMany =
  (...sortFuncs: PostSort[]): PostSort =>
  (a, b): 0 | -1 | 1 => {
    let order: 0 | 1 | -1 = 0
    for (let sortFunc of sortFuncs) {
      order = sortFunc(a, b)
      if (order !== 0) {
        break
      }
    }

    return order
  }

export { alphabetically, newestFirst, sortByMany }
