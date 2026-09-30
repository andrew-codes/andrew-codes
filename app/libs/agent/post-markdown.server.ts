import path from "path"
import { profile } from "../../data/profile"
import { getMdxPostMarkdownInput } from "../mdx.server"
import { transformMdxToMarkdown } from "./mdx-to-markdown"

// The markdown body of a post, from its MDX source. The page bundles each
// relative asset with a content hash (`showcase.png` is served as
// `/files/showcase-YPPAN7NR.png`), so the twin finds the URL in the same
// compiled code the page renders from and the two always agree.

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const createAssetResolver = (code: string) => (assetPath: string) => {
  const { name, ext } = path.parse(assetPath)
  return new RegExp(`/files/${escapeRegExp(name)}-[A-Z0-9]{8}${escapeRegExp(ext)}`).exec(code)?.[0]
}

const loadPostMarkdown = async (slug: string): Promise<string> => {
  const { content, code, codeAssets } = await getMdxPostMarkdownInput(slug)

  return transformMdxToMarkdown(content, { siteUrl: profile.url, resolveAsset: createAssetResolver(code), codeAssets })
}

// One transform per post per build process: the post's twin and llms-full.txt
// both need it, and each transform compiles the post.
const cache = new Map<string, Promise<string>>()

const getPostMarkdown = (slug: string): Promise<string> => {
  let pending = cache.get(slug)
  if (!pending) {
    pending = loadPostMarkdown(slug)
    pending.catch(() => cache.delete(slug))
    cache.set(slug, pending)
  }
  return pending
}

export { createAssetResolver, getPostMarkdown }
