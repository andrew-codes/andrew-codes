import type { ReactNode } from "react"
import type { Category } from "../types"
import { categories } from "../types"

const getCategories = (): readonly Category[] => categories

const colors: Record<Category, string[]> = {
  explanation: ["rgba(174, 64, 202)", "rgba(180, 66, 201)"] as string[],
  presentation: ["rgba(49, 163, 86)", "rgba(58, 178, 123)"] as string[],
  tutorial: ["rgba(196, 75, 120)", "rgba(198, 75, 87)"] as string[],
  reference: ["rgba(59, 119, 188)", "rgba(82, 152, 197)"] as string[],
  "not categorized": [],
}

const colorGradient: Record<Category, string> = {
  explanation: `linear-gradient(45deg, ${colors["explanation"].join(", ")})`,
  presentation: `linear-gradient(45deg, ${colors["presentation"].join(", ")})`,
  tutorial: `linear-gradient(45deg, ${colors["tutorial"].join(", ")})`,
  reference: `linear-gradient(45deg, ${colors["reference"].join(", ")})`,
  "not categorized": "rgb(255,255,255)",
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
  "not categorized": <>Posts that have not been categorized.</>,
}
const getBackgroundGradient = (name: Category | undefined | null): string => {
  return name ? (colorGradient[name] ?? "rgb(255,255,255)") : "rgb(255,255,255)"
}

const getColors = (name: Category | undefined | null): string[] =>
  name ? (colors[name] ?? []) : []

const getDescription = (
  name: Category | undefined | null,
): string | ReactNode => (name ? (descriptions[name] ?? "") : "")

export { getBackgroundGradient, getCategories, getColors, getDescription }
