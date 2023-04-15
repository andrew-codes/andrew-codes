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
  explanation:
    "linear-gradient(45deg, rgba(181, 60, 255, 0.75), rgba(249, 82, 255, 0.75))",
  presentation:
    "linear-gradient(45deg, rgba(35, 189, 56, 0.75), rgba(65, 235, 169, 0.75))",
  tutorial:
    "linear-gradient(45deg, rgba(248, 87, 166, 0.75), rgba(255, 88, 88, 0.75))",
  reference:
    "linear-gradient(45deg, rgba(50, 122, 231, 0.75), rgba(107, 208, 255, 0.75))",
}

const descriptions: Record<Category, string | ReactNode> = {
  explanation: (
    <>
      Attempt to document my learnings throughout my career; coalescing into
      articles that predominately explain concepts and technologies.
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
