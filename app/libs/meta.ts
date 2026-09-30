import type { MetaDescriptor } from "react-router"
import { profile } from "../data/profile"

// The one place page <head> metadata is built. React Router's <Meta /> renders
// only the last matched route's `meta` array (see CLAUDE.md), so nothing here
// can live in root.tsx: every route calls buildMeta() and returns the result.
// Only the charset (and other truly global tags) stay literal in root.tsx.

type ArticleMeta = {
  // `YYYY-MM-DD`, or any ISO 8601 date-time.
  publishedTime?: string
  tags?: readonly string[]
  section?: string
}

type BuildMetaOptions = {
  title: string
  description: string
  // Site-relative pathname, e.g. `/posts/my-post`. Query strings are not part
  // of a canonical URL.
  path: string
  // `article` for posts; everything else is a plain `website`.
  type?: "website" | "article"
  article?: ArticleMeta
  // schema.org JSON-LD objects, each emitted as its own
  // `<script type="application/ld+json">` (see structured-data.ts).
  jsonLd?: readonly Record<string, unknown>[]
  // Site-relative path of this page's markdown twin, advertised to agents as
  // `<link rel="alternate" type="text/markdown">`.
  markdownPath?: string
}

// The deployed site serves every page from a directory index, and redirects
// the slash-less form to `/path/`. The canonical is the URL that answers 200.
const toCanonicalUrl = (path: string) => {
  const pathname = path.split(/[?#]/)[0]
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`

  return new URL(withSlash, profile.url).toString()
}

const toAbsoluteUrl = (path: string) => new URL(path, profile.url).toString()

const buildMeta = ({ title, description, path, type = "website", article, jsonLd = [], markdownPath }: BuildMetaOptions): MetaDescriptor[] => {
  const url = toCanonicalUrl(path)

  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...(markdownPath ? [{ tagName: "link", rel: "alternate", type: "text/markdown", href: toAbsoluteUrl(markdownPath) } as const] : []),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:image", content: toAbsoluteUrl(profile.image) },
    { property: "og:site_name", content: profile.displayName },
    { property: "og:locale", content: "en_US" },
  ]

  if (type === "article" && article) {
    if (article.publishedTime) meta.push({ property: "article:published_time", content: article.publishedTime })
    if (article.section) meta.push({ property: "article:section", content: article.section })
    for (const tag of article.tags ?? []) meta.push({ property: "article:tag", content: tag })
  }

  for (const entry of jsonLd) meta.push({ "script:ld+json": entry } as MetaDescriptor)

  return meta
}

export { buildMeta, toCanonicalUrl }
export type { BuildMetaOptions }
