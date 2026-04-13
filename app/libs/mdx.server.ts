import fs from "fs/promises"
import { merge } from "lodash-es"
import { bundleMDX } from "mdx-bundler"
import path from "path"
import calculateReadingTime from "reading-time"
import type { MdxPage, MdxPageFile } from "../types"
import { readDir, readDirFiles } from "./fs.server"

type MdxOptions = {
  request?: Request
  forceFresh?: boolean | string
}

const mdx = async (
  mdxFile: MdxPageFile,
  fileContents: Record<string, string> = {},
): Promise<{ code: string; frontmatter: Record<string, any>; readTime: ReturnType<typeof calculateReadingTime> }> => {
  const source = await fs.readFile(mdxFile.filePath, "utf8")

  const { default: remarkMdxImages } = await import("remark-mdx-images")
  const { default: remarkGfm } = await import("remark-gfm")
  const { default: rehypeHighlight } = await import("rehype-highlight")
  const { default: remarkParse } = await import("remark-parse")
  const { default: remarkRehype } = await import("remark-rehype")

  const { code, frontmatter, errors } = await bundleMDX({
    source: source.trim(),
    cwd: path.dirname(path.resolve(mdxFile.filePath)),
    files: fileContents,
    globals: { "@emotion/styled": "styled" },
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkParse,
        remarkMdxImages,
        remarkGfm,
        // remarkRehype,
        rehypeHighlight,
      ] as unknown as any

      return options
    },

    esbuildOptions(options, frontmatter) {
      options.minify = true
      // Emit all MDX file assets to the globally served static directory.
      options.outdir = path.resolve("app", "public", "files")
      options.loader = {
        ...options.loader,
        ".png": "file",
        ".svg": "file",
        ".mp4": "file",
        ".jpg": "file",
        ".gif": "file",
      }
      options.publicPath = "/files"
      options.write = true

      return options
    },
  })

  const readTime = calculateReadingTime(source)
  return { code, frontmatter, readTime }
}

const getMdxFiles = async (
  fileDirPath: string,
): Promise<Record<string, MdxPageFile>> => {
  const allFilesInPostsDirectory = await readDir(fileDirPath)
  return allFilesInPostsDirectory
    .filter(
      (filePath) =>
        /^.*\.mdx?$/.test(filePath) &&
        path.basename(filePath) !== "AGENTS.md",
    )

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
): Promise<Record<string, string>> => {
  try {
    const assetsFiles = await readDirFiles(
      path.join(
        mdxFile.filePath.replace(new RegExp(`${mdxFile.fileName}$`), ""),
        "assets",
      ),
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

const getMdxPage = async (
  slug: string,
  options: MdxOptions = {},
  fileDirPath: string = "app/posts",
  extraFilesPath: string = "app/components",
): Promise<MdxPage> => {
  const mdxFiles = await getMdxFiles(fileDirPath)
  const mdxFile = mdxFiles[slug]

  if (!mdxFile) {
    throw new Error(`No MDX file found for slug: ${slug}`)
  }

  const componentsDir = path.join(extraFilesPath)
  const allComponentFiles = await readDirFiles(componentsDir)
  const fileContents = allComponentFiles
    .map(([filePath, contents]) => [
      `../${filePath.replace(/\\/g, "/")}`,
      contents,
    ])
    .reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  const transformedMdx = await mdx(mdxFile, fileContents)
  const codeAssets = await getCodeAssets(mdxFile)

  const output = { ...transformedMdx, slug, codeAssets }
  if (!output.frontmatter.category) {
    output.frontmatter.category = "no categorized"
  }

  return output as MdxPage
}

const getMdxPages = async (
  options: MdxOptions = {},
  fileDirPath: string = "app/posts",
  extraFilesPath: string = "app/components",
): Promise<MdxPage[]> => {
  const mdxFiles = await getMdxFiles(fileDirPath)

  const componentsDir = path.join(extraFilesPath)
  const allComponentFiles = await readDirFiles(componentsDir)
  const fileContents = allComponentFiles
    .map(([filePath, contents]) => [
      `../${filePath.replace(/\\/g, "/")}`,
      contents,
    ])
    .reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  const pages: MdxPage[] = []
  for (const mdxFile of Object.values(mdxFiles)) {
    const transformedMdx = await mdx(mdxFile, fileContents)
    const codeAssets = await getCodeAssets(mdxFile)
    const output = { ...transformedMdx, slug: mdxFile.slug, codeAssets }
    if (!output.frontmatter.category) {
      output.frontmatter.category = "not categorized"
    }
    pages.push(output as MdxPage)
  }

  return pages
}

export { getMdxPage, getMdxPages }
