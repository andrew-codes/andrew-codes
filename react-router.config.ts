import type { Config } from "@react-router/dev/config"
import { readDir } from "./app/libs/fs.server"

export default {
  serverBuildFile: "index.js",
  prerender: true,
} satisfies Config
