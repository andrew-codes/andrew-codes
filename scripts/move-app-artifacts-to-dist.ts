import fsExtra from "fs-extra"
import path from "path"

const here = (...s: string[]) => path.join(__dirname, ...s)

const run = async () => {
  const appDir = here("..", "dist", "app")
  await fsExtra.ensureDir(here(appDir))
  await fsExtra.copy(here("..", "build"), here(appDir, "build"))
  await fsExtra.copy(
    here("..", "app", "components"),
    here(appDir, "app", "components"),
  )
  await fsExtra.copy(here("..", "public"), here(appDir, "public"))
  await fsExtra.copy(here("..", "server-build.app"), here(appDir, "app.router"))
  await fsExtra.copy(here("..", "config", "app"), here(appDir, "config", "app"))
  await fsExtra.chmod(here("..", ".babelrc"), here(appDir, ".babelrc"))
  await fsExtra.chmod(
    here("..", "tsconfig.json"),
    here(appDir, "tsconfig.json"),
  )

  await fsExtra.remove(here("..", "server-build.app"))
  await fsExtra.remove(here("..", "build"))
  await fsExtra.remove(here("..", "public", "build"))
}

if (require.main !== module) {
  run()
}
export default run
