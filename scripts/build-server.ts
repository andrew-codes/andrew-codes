import fsExtra from "fs-extra"
import path from "path"
import glob from "glob"
import pkg from "../package.json"

const here = (...s: string[]) => path.join(__dirname, ...s)

const allFiles = glob.sync("server/**/*.*", {
  ignore: ["**/tsconfig.json", "**/eslint*", "**/__tests__/**"],
})

const entries = []
for (const file of allFiles) {
  if (/\.(ts|js|tsx|jsx)$/.test(file)) {
    entries.push(file)
  } else {
    const dest = file.replace("server", "server-build")
    console.log(file, dest)
    fsExtra.ensureDir(path.parse(dest).dir)
    fsExtra.copySync(file, dest)
    console.log(`copied: ${file.replace(`${here("server")}/`, "")}`)
  }
}

console.log(`
building...`)

require("esbuild")
  .build({
    entryPoints: glob.sync("server/**/*.ts"),
    outdir: here("../server-build"),
    target: [`node${pkg.engines.node}`],
    platform: "node",
    format: "cjs",
    logLevel: "info",
  })
  .catch((error: any) => {
    console.error(error)
    process.exit(1)
  })
