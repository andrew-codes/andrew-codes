import fs from "fs/promises"
import type { Config } from "@react-router/dev/config"
import { readDir } from "./app/libs/fs.server"

const getTagsFromFile = async (filePath: string): Promise<string[]> => {
  const content = await fs.readFile(filePath, "utf8")
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return []
  const frontmatter = match[1]
  const tagsMatch = frontmatter.match(/^tags:\s*\n((?:[ \t]+-[^\n]*\n?)+)/m)
  if (!tagsMatch) return []
  return tagsMatch[1]
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
}

export default {
  serverBuildFile: "index.js",
  prerender: async () => {
    const allFiles = await readDir("app/posts")
    const mdxFiles = allFiles.filter(
      (f) => /\.mdx?$/.test(f) && !f.endsWith("AGENTS.md"),
    )
    const slugs = mdxFiles.map((f) => {
      const parts = f.replace(/\\/g, "/").split("/")
      return parts[parts.length - 1].replace(/\.mdx?$/, "")
    })

    const tagSets = await Promise.all(mdxFiles.map(getTagsFromFile))
    const uniqueTags = [...new Set(tagSets.flat())]

    return [
      "/",
      "/posts",
      "/recommendations",
      ...slugs.map((slug) => `/posts/${slug}`),
      ...uniqueTags.map((tag) => `/tags/${tag}`),
    ]
  },
} satisfies Config
