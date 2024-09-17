import type { ReactNode } from "react"
import type { Category } from "../types"
import { categories } from "../types"

const getCategories = (): readonly Category[] => categories

const colors: Record<Category, string[]> = {
  engineering: ["rgba(174, 64, 202)", "rgba(180, 66, 201)"] as string[],
  presentation: ["rgba(49, 163, 86)", "rgba(58, 178, 123)"] as string[],
  agility: ["rgba(196, 75, 120)", "rgba(198, 75, 87)"] as string[],
  "home automation": ["rgba(59, 119, 188)", "rgba(82, 152, 197)"] as string[],
  "not categorized": [],
}

const colorGradient: Record<Category, string> = {
  engineering: `linear-gradient(45deg, ${colors["engineering"].join(", ")})`,
  presentation: `linear-gradient(45deg, ${colors["presentation"].join(", ")})`,
  agility: `linear-gradient(45deg, ${colors["agility"].join(", ")})`,
  "home automation": `linear-gradient(45deg, ${colors["home automation"].join(", ")})`,
  "not categorized": "rgb(255,255,255)",
}

const descriptions: Record<Category, string | ReactNode> = {
  engineering: (
    <>
      Document my learnings throughout my career relating to software
      engineering.
    </>
  ),
  presentation: (
    <>
      Presentations and workshops I've given at conferences, meetups, etc.;
      freely available.
    </>
  ),
  agility: (
    <>
      Articles about practices and tools that I've used to improve agility; both
      personally and in the context of a team.
    </>
  ),
  "home automation": <>Posts relating to my home automation journey.</>,
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
