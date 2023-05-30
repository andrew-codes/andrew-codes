import fsExtra, { ensureDir } from "fs-extra"
import path from "path"

const ensureStagedAppDirectory = async (): Promise<string> => {
  if (
    process.env.APP_STAGING_DIR === undefined ||
    process.env.PR_NUMBER === undefined
  ) {
    throw new Error("APP STAGING environment variables not set")
  }

  const appDir = path.join(
    process.env.APP_STAGING_DIR,
    `pr-${process.env.PR_NUMBER}`,
  )
  await ensureDir(appDir)

  return appDir
}

const run = async () => {
  try {
    const stagedAppDirectory = await ensureStagedAppDirectory()
    const distAppDir = path.join(__dirname, "..", "dist")
    await fsExtra.copy(
      path.join(distAppDir, "build"),
      path.join(stagedAppDirectory, "build"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "app"),
      path.join(stagedAppDirectory, "app"),
    )
    await fsExtra.copy(
      path.join(distAppDir, ".babelrc"),
      path.join(stagedAppDirectory, ".babelrc"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "app.router"),
      path.join(stagedAppDirectory, "app.router"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "public"),
      path.join(stagedAppDirectory, "public"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "config"),
      path.join(stagedAppDirectory, "config"),
    )
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

if (require.main === module) {
  run()
}
export default run
