import fs from "fs/promises"
import { bundleMDX } from "mdx-bundler"
import path from "path"
import { merge } from "lodash"
import { readDir, readDirFiles } from "./fs.server"
import type { CachifiedOptions } from "./cache.server"
import {
  cachified,
  defaultTtl,
  defaultStaleWhileRevalidate,
  getCache,
} from "./cache.server"
import type { MdxPage, MdxPageFile } from "../types"

const mdx = async (
  mdxFile: MdxPageFile,
): Promise<{ code: string; frontmatter: Record<string, any> }> => {
  const source = await fs.readFile(mdxFile.filePath, "utf8")
  const componentsDir = path.join("app", "components")
  const allComponentFiles = await readDirFiles(componentsDir)
  const files = allComponentFiles
    .filter(([filePath]) => !/GlobalStyles\.tsx/.test(filePath))
    .map(([filePath, contents]) => [
      `../${filePath.replace(/\\/g, "/")}`,
      contents,
    ])
    .reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  const postDir = path.join(__dirname, "..", "app", "posts")
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
      ] as unknown as any

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

  return { code, frontmatter }
}

const getMdxFiles = async (
  options: CachifiedOptions,
): Promise<Record<string, MdxPageFile>> => {
  const allFilesInPostsDirectory = await readDir(
    path.join(__dirname, "..", "app", "posts"),
  )
  return allFilesInPostsDirectory
    .filter((filePath) => /^.*\.mdx?$/.test(filePath))

    .reduce((acc, filePath) => {
      const slug = path.basename(filePath).replace(/\.mdx?$/, "")

      return {
        ...acc,
        [slug]: { slug, filePath, fileName: path.basename(filePath) },
      }
    }, {})
}

const getCodeAssets = async (
  mdxFile: MdxPageFile,
  options: CachifiedOptions,
): Promise<Record<string, string>> => {
  try {
    const assetsFiles = await readDirFiles(
      path.join(mdxFile.filePath, "assets"),
    )
    return assetsFiles
      .filter(([assetFilePath]) => /.*\.code\.*/.test(assetFilePath))
      .reduce(
        (acc, [assetFilePath, assetFileContent]) => ({
          ...acc,
          [path.basename(assetFilePath)]: assetFileContent,
        }),
        {},
      )
  } catch (error) {
    return {} as Record<string, string>
  }
}

const checkCompiledValue = (value: unknown) =>
  typeof value === "object" &&
  (value === null || ("code" in value && "frontmatter" in value))

const getMdxPage = async (
  slug: string,
  options: CachifiedOptions,
): Promise<MdxPage> => {
  const { forceFresh, ttl = defaultTtl, request, timings } = options
  const key = `mdx-page:${slug}:compiled`
  const cache = await getCache()

  const page = cachified({
    key,
    cache,
    request,
    timings,
    ttl,
    staleWhileRevalidate: defaultStaleWhileRevalidate,
    forceFresh,
    checkValue: checkCompiledValue,
    getFreshValue: async () => {
      const mdxFiles = await getMdxFiles(options)
      const mdxFile = mdxFiles[slug]
      const transformedMdx = await mdx(mdxFile)

      const codeAssets = await getCodeAssets(mdxFile, options)

      const output = { ...transformedMdx, slug, codeAssets }
      if (!output.frontmatter.category) {
        output.frontmatter.category = "no categorized"
      }

      return output
    },
  })

  if (!page) {
    void cache.delete(key)
  }

  return page as unknown as MdxPage
}

const getMdxPages = async (options: CachifiedOptions): Promise<MdxPage[]> => {
  const mdxFiles = await getMdxFiles(options)
  let pages = []
  for (const mdxFile of Object.values(mdxFiles)) {
    const page = await getMdxPage(mdxFile.slug, options)
    pages.push(page)
  }

  return pages
}

export { getMdxPage, getMdxPages }
