import { bundleMDX } from "mdx-bundler"
import path from "path"
import { merge } from "lodash"
import { readDirFiles } from "./fs.server"

const mdx = async (source: string) => {
  const componentsDir = path.join("app", "components")
  const allComponentFiles = await readDirFiles(componentsDir)
  const files = allComponentFiles
    .filter(([filePath]) => !/GlobalStyles\.tsx/.test(filePath))
    .map(([filePath, contents]) => [
      `../${filePath.replace(/\\/g, "/")}`,
      contents,
    ])
    .reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  const postDir = path.join("app", "posts")
  const { default: remarkMdxImages } = await import("remark-mdx-images")
  const { default: remarkGfm } = await import("remark-gfm")
  const { default: rehypeHighlight } = await import("rehype-highlight")
  const { default: remarkParse } = await import("remark-parse")
  const { default: remarkRehype } = await import("remark-rehype")

  const { code, frontmatter } = await bundleMDX({
    source: source.trim(),
    cwd: path.resolve(postDir),
    files,
    globals: { "styled-components": "styled" },
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkParse,
        remarkMdxImages,
        remarkGfm,
        remarkRehype,
        rehypeHighlight,
      ]

      return options
    },

    esbuildOptions(options, frontmatter) {
      options.minify = true
      options.outdir = path.resolve(postDir, "..", "public", "files")
      options.loader = {
        ...options.loader,
        ".png": "file",
        ".mp4": "file",
        ".jpg": "file",
        ".gif": "file",
      }
      options.publicPath = "/files"
      options.write = true

      return options
    },
  })

  return [code, frontmatter]
}

export default mdx
