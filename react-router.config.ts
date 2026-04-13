import type { Config } from "@react-router/dev/config"
import { readDir } from "./app/libs/fs.server"

export default {
  serverBuildFile: "index.js",
  prerender: async () => {
    const allFiles = await readDir("app/posts")
    const slugs = allFiles
      .filter((f) => /\.mdx?$/.test(f) && !f.endsWith("AGENTS.md"))
      .map((f) => {
        const parts = f.replace(/\\/g, "/").split("/")
        return parts[parts.length - 1].replace(/\.mdx?$/, "")
      })

    return [
      "/",
      "/posts",
      "/recommendations",
      ...slugs.map((slug) => `/posts/${slug}`),
    ]
  },
} satisfies Config
