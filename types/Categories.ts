const categories = [
  "explanation",
  "presentation",
  "tutorial",
  "reference",
] as const
type Category = (typeof categories)[number] | "not categorized"

export { categories }
export type { Category }
