import fsExtra from "fs-extra"
import path from "path"

const here = (...s: string[]) => path.join(__dirname, ...s)

const run = async () => {
  const appDir = path.join(__dirname, "..", "dist")
  await fsExtra.ensureDir(path.join(appDir))
  await fsExtra.copy(here("../build"), path.join(appDir, "build"))
  await fsExtra.copy(
    here("../app/components"),
    path.join(appDir, "app", "components"),
  )
  await fsExtra.copy(here("../app/posts"), path.join(appDir, "app", "posts"))
  await fsExtra.copy(here("../app/libs"), path.join(appDir, "app", "libs"))
  await fsExtra.copy(here("../public"), path.join(appDir, "public"))
  await fsExtra.copy(here("../server-build"), path.join(appDir, "server"))
  await fsExtra.copy(here("../config/app"), path.join(appDir, "config", "app"))
  await fsExtra.copy(here("../.babelrc"), path.join(appDir, ".babelrc"))
  await fsExtra.copy(
    here("../tsconfig.json"),
    path.join(appDir, "tsconfig.json"),
  )
}

if (require.main === module) {
  run()
}
export default run
