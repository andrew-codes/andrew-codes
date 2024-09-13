import { build } from "esbuild"
import fsExtra from "fs-extra"
import { sync } from "glob"
import path from "path"
import pkg from "../package.json" with { type: "json" }

const here = (...s: string[]) => path.join(import.meta.dirname, ...s)

try {
  const allFiles = sync("server/**/*.*", {
    ignore: ["**/tsconfig.json", "**/eslint*", "**/__tests__/**"],
  })

  const entries = []
  for (const file of allFiles) {
    if (/\.(ts|js|tsx|jsx)$/.test(file)) {
      entries.push(file)
    } else {
      const dest = file.replace("server", "server-build")
      await fsExtra.ensureDir(path.parse(dest).dir)
      fsExtra.copySync(file, dest)
      console.log(`copied: ${file.replace(`${here("server")}/`, "")}`)
    }
  }

  console.log(`
building app router...`)

  await build({
    bundle: true,
    entryPoints: sync("index.ts"),
    format: "esm",
    logLevel: "info",
    minify: true,
    outdir: here("../server-build"),
    platform: "node",
    target: [`node${pkg.engines.node}`],
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
    external: [
      "lightningcss",
      "fsevents",
      "esbuild",
      "better-sqlite3",
      "./build/server/index.js",
    ],
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);const __dirname = import.meta.dirname; import { fileURLToPath } from 'url'; const __filename = fileURLToPath(import.meta.url)",
    },
  })

  const excluded = sync("app/*.ts")
    .concat(sync("app/*.tsx"))
    .concat(sync("app/routes/*.tsx"))
    .concat(sync("app/libs/**/*.server.ts"))
    .concat(sync("app/**/*.d.ts"))
  const mdxComponentsEntryPoints = sync("app/**/*.ts")
    .concat(sync("app/**/*.tsx"))
    .filter((file) => !excluded.includes(file))
  console.log(mdxComponentsEntryPoints)

  await build({
    bundle: false,
    entryPoints: mdxComponentsEntryPoints,
    format: "esm",
    logLevel: "info",
    minify: true,
    outdir: here("..", "dist", "app"),
    platform: "node",
    target: [`node${pkg.engines.node}`],
  })
} catch (error: any) {
  console.error(error)
  process.exit(1)
}
