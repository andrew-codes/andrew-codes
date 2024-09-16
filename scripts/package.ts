import fsExtra from "fs-extra"
import path from "path"

const here = (...s: string[]) => path.join(import.meta.dirname, ...s)

const dist = here("..", "dist")

await fsExtra.ensureDir(path.join(dist))

await fsExtra.copy(here("..", "build"), path.join(dist, "build"))
await fsExtra.copy(here("..", "app", "posts"), path.join(dist, "app", "posts"))
await fsExtra.copy(
  here("..", "app", "public"),
  path.join(dist, "app", "public"),
)
await fsExtra.copy(
  here("..", "server-build", "index.js"),
  path.join(dist, "index.js"),
)
await fsExtra.copy(
  here("..", "server-build", "_redirects.txt"),
  path.join(dist, "server", "_redirects.txt"),
)
