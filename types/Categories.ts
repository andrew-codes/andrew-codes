const categories = [
  "engineering",
  "agility",
  "presentation",
  "home automation",
] as const
type Category = (typeof categories)[number] | "not categorized"

export { categories }
export type { Category }
