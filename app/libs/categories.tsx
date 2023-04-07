import type { ReactNode } from "react"

const categories = [
  "explanation",
  "presentation",
  "tutorial",
  "reference",
] as const
type Category = (typeof categories)[number]

const getCategories = (): readonly Category[] => categories

const colors: Record<Category, string> = {
  explanation: "linear-gradient(45deg, rgb(181, 60, 255), rgb(249, 82, 255))",
  presentation: "linear-gradient(45deg, rgb(35, 189, 56), rgb(65, 235, 169))",
  tutorial: "linear-gradient(45deg, rgb(248, 87, 166), rgb(255, 88, 88))",
  reference: "linear-gradient(45deg, rgb(50, 122, 231), rgb(107, 208, 255))",
}

const descriptions: Record<Category, string | ReactNode> = {
  explanation: (
    <>
      Attempt to document my learnings throughout my career; coalescing into
      articles that predominately explain concepts and technologies..
    </>
  ),
  presentation: (
    <>
      Presentations and workshops I've given at conferences, meetups, etc.;
      freely available.
    </>
  ),
  tutorial: (
    <>
      Articles that are focused steps detailing how to accomplish specific
      goals.
    </>
  ),
  reference: <>Evaluation or comparison of technologies.</>,
}
const getColor = (name: Category): string => {
  return colors[name] ?? "rgb(255,255,255)"
}

const getDescription = (name: Category): string | ReactNode =>
  descriptions[name] ?? ""

export { getCategories, getDescription, getColor }
export type { Category }
