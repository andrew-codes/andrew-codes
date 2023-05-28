import fsExtra from "fs-extra"
import path from "path"
import { sync } from "glob"
import pkg from "../package.json"

const here = (...s: string[]) => path.join(__dirname, ...s)

const run = async () => {
  try {
    const allFiles = sync("app.router/**/*.*", {
      ignore: ["**/tsconfig.json", "**/eslint*", "**/__tests__/**"],
    })

    const entries = []
    for (const file of allFiles) {
      if (/\.(ts|js|tsx|jsx)$/.test(file)) {
        entries.push(file)
      } else {
        const dest = file.replace("app.router", "server-build.app")
        console.log(file, dest)
        await fsExtra.ensureDir(path.parse(dest).dir)
        fsExtra.copySync(file, dest)
        console.log(`copied: ${file.replace(`${here("app.router")}/`, "")}`)
      }
    }

    console.log(`
building...`)

    await require("esbuild").build({
      entryPoints: sync("app.router/**/*.ts"),
      outdir: here("../server-build.app"),
      target: [`node${pkg.engines.node}`],
      platform: "node",
      format: "cjs",
      logLevel: "info",
    })
  } catch (error: any) {
    console.error(error)
    process.exit(1)
  }
}

if (require.main !== module) {
  run()
}

export default run
