const fsExtra = require("fs-extra")
const path = require("path")
const glob = require("glob")
const pkg = require("../package.json")

const here = (...s) => path.join(__dirname, ...s)

const allFiles = glob.sync("server/**/*.*", {
  ignore: ["**/tsconfig.json", "**/eslint*", "**/__tests__/**"],
})

console.log(allFiles)

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
    entryPoints: [here("../server/index.ts")],
    outdir: here("../server-build"),
    target: [`node${pkg.engines.node}`],
    platform: "node",
    format: "cjs",
    logLevel: "info",
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
