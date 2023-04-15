import type { Post } from "./types"
type PostSort = (a: [string, Post], b: [string, Post]) => 0 | 1 | -1

const newestFirst: PostSort = ([_, [__, a]], [___, [____, b]]) => {
  if (a?.date?.getTime() ?? 0 > (b?.date?.getTime() ?? 0)) {
    return -1
  }
  if (b?.date?.getTime() ?? 0 > (a?.date?.getTime() ?? 0)) {
    return 1
  }

  return 0
}

const alphabetically: PostSort = ([_, [__, a]], [___, [____, b]]) => {
  if (a?.title > b?.title) {
    return 1
  }
  if (b?.title > a?.title) {
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
