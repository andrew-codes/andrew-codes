import { spawn } from "child_process"
import fs from "fs/promises"
import { merge } from "lodash-es"
import { bundleMDX } from "mdx-bundler"
import path from "path"
import remarkMdx from "remark-mdx"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import type { MdxPage, MdxPageFile } from "../types"
import type { CachifiedOptions } from "./cache.server"
import {
  cachified,
  defaultStaleWhileRevalidate,
  defaultTtl,
  getCache,
} from "./cache.server"
import { readDir, readDirFiles } from "./fs.server"
import { DEFAULT_OPTIONS } from "./mdx.server/remark/plugins/defaults"

const __dirname =
  import.meta.dirname || path.dirname(new URL(import.meta.url).pathname)

const mdx = async (
  mdxFile: MdxPageFile,
  fileContents: Record<string, string> = {},
): Promise<{ code: string; frontmatter: Record<string, any> }> => {
  const source = await fs.readFile(mdxFile.filePath, "utf8")
  const { default: remarkMdxImages } = await import("remark-mdx-images")
  const { default: remarkGfm } = await import("remark-gfm")
  const { default: rehypeHighlight } = await import("rehype-highlight")
  const { default: remarkParse } = await import("remark-parse")

  // Step 1: Parse the MDX file and detect image references
  const mdxAst = unified().use(remarkParse).use(remarkMdx).parse(source)
  let count = 0
  const imageFiles: Record<string, string> = {}
  const generatedImages = [] as Array<Promise<void>>
  visit(mdxAst, "code", (node: any) => {
    if (node.lang !== "d2") {
      return
    }
    generatedImages.push(
      new Promise(async (resolve) => {
        await fs.mkdir(
          path.join(path.dirname(mdxFile.filePath), mdxFile.slug, "d2"),
          {
            recursive: true,
          },
        )
        const urlPath = `./${mdxFile.slug}/d2/${count}.png`
        count++
        imageFiles[urlPath] = path.resolve(
          path.dirname(mdxFile.filePath),
          urlPath,
        )

        const d2 = spawn("d2", [
          "-t=100",
          "--dark-theme=200",
          "-",
          imageFiles[urlPath],
        ])

        d2.stdin.write(node.value)
        d2.stdin.end()
        d2.on("close", (code) => {
          resolve()
        })
      }),
    )
  })
  await Promise.all(generatedImages)

  visit(mdxAst, "image", (node: any) => {
    const imagePath = node.url
    if (imagePath && !imageFiles[imagePath] && imagePath.startsWith("./")) {
      const resolvedPath = path.resolve(
        path.dirname(mdxFile.filePath),
        imagePath,
      )
      imageFiles[imagePath] = resolvedPath
    }
  })

  const imageContents: Record<string, string> = {}
  for (const [imagePath, resolvedPath] of Object.entries(imageFiles)) {
    const imageData = await fs.readFile(resolvedPath)
    // Must pass binary data and fake its type as a string. This avoid double base64 encoding.
    imageContents[imagePath] = imageData as unknown as string
  }

  const imageAttrs: Record<string, any> = {}
  const { code, frontmatter, errors } = await bundleMDX({
    source: source.trim(),
    cwd: path.resolve(mdxFile.filePath),
    files: {
      ...fileContents,
      ...imageContents,
    },
    globals: { "@emotion/styled": "styled" },
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkParse,
        () => {
          const opts = { ...DEFAULT_OPTIONS }
          // Verify options
          if (path.isAbsolute(opts.compilePath) && !opts.unsafe) {
            throw new Error(
              "remark-d2: compilePath is an absolute path and unsafe is false. No transformation done",
            )
          }

          opts.compilePath = path.normalize(opts.compilePath)
          opts.linkPath = path.normalize(opts.linkPath)

          return (tree, file) => {
            let count = 0
            const linkDir = path.join(`./${mdxFile.slug}/d2`)

            visit(tree, "code", (node) => {
              const { lang, meta } = node
              if (!lang || lang !== "d2") {
                return
              }

              const image = `${count}.${opts.ext}`

              const urlPath = path.join(linkDir, image)

              delete node.value
              delete node.lang
              node.type = "image"
              node.url = urlPath
              node.alt = opts.defaultImageAttrs.alt
              node.title = opts.defaultImageAttrs.alt
              ;(meta ?? "")?.split(";")?.forEach((kv) => {
                const [key, value] = kv.split("=").map((s) => s.trim())
                imageAttrs[urlPath] = {
                  ...(imageAttrs[urlPath] ?? {}),
                  [key]: value,
                }
              })
              count++
            })

            return tree
          }
        },
        [remarkMdxImages],
        () => {
          return (tree) => {
            visit(tree, "mdxJsxTextElement", (node) => {
              if (node.name !== "img") {
                return
              }
              const src =
                node?.attributes
                  ?.find((attr) => attr.name === "src")
                  ?.value?.value?.split("_d2_")?.[1]
                  ?.split("_")?.[0] ?? null
              if (!src) {
                return
              }
              const attributes =
                imageAttrs[path.join(`./${mdxFile.slug}/d2/${src}.png`)] ?? {}

              node.attributes = node.attributes.concat(
                Object.entries(attributes).map(([key, value]) => {
                  return {
                    type: "mdxJsxAttribute",
                    name: key,
                    value,
                  }
                }),
              )
            })
          }
        },
        remarkGfm,
        // remarkRehype,
        rehypeHighlight,
      ] as unknown as any

      return options
    },

    esbuildOptions(options, frontmatter) {
      options.minify = true
      options.outdir = path.resolve(
        __dirname,
        "../public/images/posts",
        mdxFile.slug,
      )
      options.loader = {
        ...options.loader,
        ".png": "dataurl",
        ".mp4": "file",
        ".jpg": "dataurl",
        ".gif": "dataurl",
        ".webp": "dataurl",
        ".svg": "dataurl",
      }
      options.publicPath = `/images/posts/${mdxFile.slug}`
      options.write = true

      return options
    },
  })

  return { code, frontmatter }
}

const getMdxFiles = async (
  options: CachifiedOptions,
  fileDirPath: string,
): Promise<Record<string, MdxPageFile>> => {
  const allFilesInPostsDirectory = await readDir(fileDirPath)
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
      path.join(
        mdxFile.filePath.replace(new RegExp(`${mdxFile.fileName}$`), ""),
        mdxFile.slug,
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

const checkCompiledValue = (value: unknown) =>
  typeof value === "object" &&
  (value === null || ("code" in value && "frontmatter" in value))

const getMdxPage = async (
  slug: string,
  options: CachifiedOptions,
  fileDirPath?: string,
  filesContents: Record<string, string> = {},
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
      if (!fileDirPath) {
        const pages = await getMdxPages(options)
        return pages.find((page) => page.slug === slug)
      }

      const mdxFiles = await getMdxFiles(options, fileDirPath)
      const mdxFile = mdxFiles[slug]
      const transformedMdx = await mdx(mdxFile, filesContents)
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

const getMdxPages = async (
  options: CachifiedOptions,
  fileDirPath: string = "app/posts",
  extraFilesPath: string = "app/components",
): Promise<MdxPage[]> => {
  const mdxFiles = await getMdxFiles(options, fileDirPath)

  const componentsDir = path.join(extraFilesPath)
  const allComponentFiles = await readDirFiles(componentsDir)
  const fileContents = allComponentFiles
    .map(([filePath, contents]) => [
      `../${filePath.replace(/\\/g, "/")}`,
      contents,
    ])
    .reduce((acc, [key, value]) => merge({}, acc, { [key]: value }), {})

  let pages = []
  for (const mdxFile of Object.values(mdxFiles)) {
    const page = await getMdxPage(
      mdxFile.slug,
      options,
      fileDirPath,
      fileContents,
    )
    pages.push(page)
  }

  return pages
}

export { getMdxPage, getMdxPages }
