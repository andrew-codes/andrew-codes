import fs from "fs/promises"
import matter from "gray-matter"
import { merge } from "lodash-es"
import { bundleMDX } from "mdx-bundler"
import path from "path"
import calculateReadingTime from "reading-time"
import type { MdxListItem, MdxPage, MdxPageFile } from "../types"
import { readDir, readDirFiles } from "./fs.server"

type MdxOptions = {
  request?: Request
  forceFresh?: boolean | string
}

const mdx = async (mdxFile: MdxPageFile, fileContents: Record<string, string> = {}): Promise<{ code: string; frontmatter: Record<string, any>; readTime: ReturnType<typeof calculateReadingTime> }> => {
  const source = await fs.readFile(mdxFile.filePath, "utf8")

  const { default: remarkMdxImages } = await import("remark-mdx-images")
  const { default: remarkGfm } = await import("remark-gfm")
  const { default: rehypeHighlight } = await import("rehype-highlight")
  const { default: remarkParse } = await import("remark-parse")

  const { code, frontmatter } = await bundleMDX({
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

    esbuildOptions(options, _frontmatter) {
      options.minify = true
      options.outdir = process.env.NODE_ENV === "production" ? path.resolve("build", "client", "files") : path.resolve("app", "public", "files")
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

const getMdxFiles = async (fileDirPath: string): Promise<Record<string, MdxPageFile>> => {
  const allFilesInPostsDirectory = await readDir(fileDirPath)
  return allFilesInPostsDirectory
    .filter((filePath) => /^.*\.mdx?$/.test(filePath) && path.basename(filePath) !== "AGENTS.md")

    .reduce((acc, filePath) => {
      const slug = path.basename(filePath).replace(/\.mdx?$/, "")

      return {
        ...acc,
        [slug]: { slug, filePath, fileName: path.basename(filePath) },
      }
    }, {})
}

const EXT_TO_LANGUAGE: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
  rb: "ruby",
  sh: "bash",
  bash: "bash",
  css: "css",
  html: "html",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  rs: "rust",
  go: "go",
}

const getCodeAssets = async (mdxFile: MdxPageFile): Promise<Record<string, { raw: string; highlightedHtml: string }>> => {
  try {
    const { default: hljs } = await import("highlight.js")
    const assetsFiles = await readDirFiles(path.join(mdxFile.filePath.replace(new RegExp(`${mdxFile.fileName}$`), ""), "assets"))
    return assetsFiles
      .filter(([assetFilePath]) => /.*\.code\.*/.test(assetFilePath))
      .reduce((acc, [assetFilePath, raw]) => {
        const ext = assetFilePath.split(".").at(-1) ?? ""
        const language = EXT_TO_LANGUAGE[ext]
        const highlightedHtml = language ? hljs.highlight(raw, { language }).value : hljs.highlightAuto(raw).value
        return {
          ...acc,
          [path.basename(assetFilePath)]: { raw, highlightedHtml },
        }
      }, {})
  } catch {
    return {}
  }
}

const getMdxPage = async (slug: string, _options: MdxOptions = {}, fileDirPath: string = "app/posts", extraFilesPath: string = "app/components"): Promise<MdxPage> => {
  const mdxFiles = await getMdxFiles(fileDirPath)
  const mdxFile = mdxFiles[slug]

  if (!mdxFile) {
    throw new Error(`No MDX file found for slug: ${slug}`)
  }

  const componentsDir = path.join(extraFilesPath)
  const allComponentFiles = await readDirFiles(componentsDir)
  const fileContents = allComponentFiles.map(([filePath, contents]) => [`../${filePath.replace(/\\/g, "/")}`, contents]).reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  const transformedMdx = await mdx(mdxFile, fileContents)
  const codeAssets = await getCodeAssets(mdxFile)

  const output = { ...transformedMdx, slug, codeAssets }
  if (!output.frontmatter.category) {
    output.frontmatter.category = "no categorized"
  }

  return output as MdxPage
}

const getMdxPages = async (_options: MdxOptions = {}, fileDirPath: string = "app/posts", extraFilesPath: string = "app/components"): Promise<MdxPage[]> => {
  const mdxFiles = await getMdxFiles(fileDirPath)

  const componentsDir = path.join(extraFilesPath)
  const allComponentFiles = await readDirFiles(componentsDir)
  const fileContents = allComponentFiles.map(([filePath, contents]) => [`../${filePath.replace(/\\/g, "/")}`, contents]).reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

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

// Front matter, slug and reading time only - no MDX compilation. bundleMDX
// parses front matter with the same gray-matter defaults, so `frontmatter`
// here is identical to what a compiled MdxPage carries.
const readMdxListItem = async (mdxFile: MdxPageFile): Promise<MdxListItem> => {
  const source = await fs.readFile(mdxFile.filePath, "utf8")
  // Passing an options object opts out of gray-matter's content-keyed cache,
  // which stores a file before parsing it: once a malformed post has thrown,
  // the cache would hand the same content back later as if it had parsed
  // cleanly, with empty front matter. Defaults are otherwise unchanged.
  const { data } = matter(source.trim(), {})
  const frontmatter = { ...data } as MdxListItem["frontmatter"]
  if (!frontmatter.category) {
    frontmatter.category = "not categorized"
  }

  return { frontmatter, readTime: calculateReadingTime(source), slug: mdxFile.slug }
}

// List views (posts index, tags, home) only render frontmatter/slug/readTime
// via PostCard - never the bundled MDX `code` or `codeAssets`. Those fields
// are the fully compiled, per-post JS and syntax-highlighted code blocks, so
// including them in a list loader's response bloats its prerendered *.data
// file to multiple megabytes, which is slow enough to fetch that route
// transitions in e2e tests (and for real visitors) can time out. They also
// cost a full compile of every post, so list views read front matter directly
// and only the post route (getMdxPage) compiles, once per post.
const getMdxListItems = async (_options: MdxOptions = {}, fileDirPath: string = "app/posts"): Promise<MdxListItem[]> => {
  const mdxFiles = await getMdxFiles(fileDirPath)
  return Promise.all(Object.values(mdxFiles).map(readMdxListItem))
}

type MdxPostSource = { slug: string; listItem: MdxListItem } | { slug: string; listItem?: undefined; error: Error }

// Like getMdxListItems, but a post whose front matter cannot be read is
// reported beside the others instead of rejecting the whole listing, so route
// enumeration still lists its slug and the failure surfaces in that post's own
// prerender.
const getMdxPostSources = async (fileDirPath: string = "app/posts"): Promise<MdxPostSource[]> => {
  const mdxFiles = await getMdxFiles(fileDirPath)
  return Promise.all(
    Object.values(mdxFiles).map(async (mdxFile): Promise<MdxPostSource> => {
      try {
        return { slug: mdxFile.slug, listItem: await readMdxListItem(mdxFile) }
      } catch (error) {
        return { slug: mdxFile.slug, error: error instanceof Error ? error : new Error(String(error)) }
      }
    }),
  )
}

export { getMdxListItems, getMdxPage, getMdxPages, getMdxPostSources }
export type { MdxPostSource }
