import type { Content, Heading, Image, Link, Parent, PhrasingContent, Root, RootContent } from "mdast"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"

// Turns a post's MDX source into plain, self-contained markdown for the
// markdown twins and llms-full.txt. The page renders MDX through React
// components; an agent reading the twin has no React, so everything that only
// makes sense inside the app is resolved or dropped here:
//
// - front matter is removed (callers write their own header from the graph);
// - `import` statements are dropped, but image imports are remembered so an
//   `<img src={logo}>` can be resolved to the file it stands for;
// - relative asset paths become the absolute URL the page itself serves the
//   file from, and root-relative links become absolute site URLs;
// - <CollapsibleSection title="..."> becomes a level 2 heading followed by its
//   content, since it is always fully expanded for a reader of markdown;
// - <CodePostAsset fileName="..."> becomes a fenced code block holding the
//   file's raw contents;
// - decorative JSX (icons, images without alt text) is dropped, and unknown
//   wrapper components are unwrapped so their content survives.
//
// Parsing uses the same MDX and GFM syntax the site compiles posts with, so a
// post that renders also parses here.

type MdxToMarkdownOptions = {
  // Origin used to make root-relative links and images absolute, e.g.
  // `https://andrew.codes`.
  siteUrl: string
  // Maps an asset path as written in the post (`./public/files/a.png`) to the
  // URL it is served from (a root-relative `/files/a-HASH.png` or an absolute
  // URL). Returns undefined when the asset cannot be found.
  resolveAsset?: (assetPath: string) => string | undefined
  // Raw contents of the post's `assets/*.code.*` files by file name, for
  // <CodePostAsset>.
  codeAssets?: Record<string, { raw: string }>
}

// The MDX-specific mdast nodes (from remark-mdx), which `mdast` does not type.
type JsxAttribute = {
  type: "mdxJsxAttribute" | "mdxJsxExpressionAttribute"
  name?: string
  value?: string | { type: string; value: string } | null
}
type JsxElement = Parent & {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement"
  name: string | null
  attributes: JsxAttribute[]
}
type MdxEsm = { type: "mdxjsEsm"; value: string }
type MdxExpression = { type: "mdxFlowExpression" | "mdxTextExpression"; value: string }
type AnyNode = Content | RootContent | JsxElement | MdxEsm | MdxExpression | { type: "yaml"; value: string }

const isJsx = (node: AnyNode): node is JsxElement => node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement"
const isExpression = (node: AnyNode): node is MdxExpression => node.type === "mdxFlowExpression" || node.type === "mdxTextExpression"
const hasChildren = (node: AnyNode): node is Parent & AnyNode => "children" in node && Array.isArray(node.children)

const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]).use(remarkGfm).use(remarkMdx)

// No remark-mdx here: by the time a tree is stringified it holds no MDX nodes,
// and its serializer would escape `{` and `<` for MDX's sake.
const serializer = unified()
  .use(remarkGfm, { tablePipeAlign: false })
  .use(remarkStringify, { bullet: "-", emphasis: "*", strong: "*", fences: true, listItemIndent: "one", rule: "-" })

// A simple JS string literal, the only kind of expression that carries text.
const STRING_LITERAL = /^\s*(?:"([^"\\]*)"|'([^'\\]*)'|`([^`\\$]*)`)\s*$/

const stringLiteral = (source: string): string | undefined => {
  const match = STRING_LITERAL.exec(source)
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined
}

const DEFAULT_IMPORT = /^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["']/

// Default imports by local name, e.g. `logo` -> `./public/files/logo.png`.
const collectImports = (root: Root): Map<string, string> => {
  const imports = new Map<string, string>()
  for (const node of root.children as AnyNode[]) {
    if (node.type !== "mdxjsEsm") continue
    for (const line of node.value.split("\n")) {
      const match = DEFAULT_IMPORT.exec(line)
      if (match) imports.set(match[1], match[2])
    }
  }
  return imports
}

const isAbsoluteUrl = (url: string) => /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")

const trimEdges = (children: PhrasingContent[]): PhrasingContent[] => {
  const result = [...children]
  const first = result[0]
  if (first?.type === "text") result[0] = { ...first, value: first.value.replace(/^\s+/, "") }
  const last = result.at(-1)
  if (last?.type === "text") result[result.length - 1] = { ...last, value: last.value.replace(/\s+$/, "") }
  return result.filter((child) => child.type !== "text" || child.value !== "")
}

const transformMdxToMarkdown = (source: string, options: MdxToMarkdownOptions): string => {
  const root = parser.parse(source) as Root
  const imports = collectImports(root)
  const { siteUrl, resolveAsset, codeAssets = {} } = options

  const toAbsolute = (url: string) => new URL(url, `${siteUrl}/`).href

  // A path written in the post, resolved to something a reader can fetch.
  const resolveUrl = (url: string): string | undefined => {
    if (isAbsoluteUrl(url) || url.startsWith("#")) return url
    if (url.startsWith("/")) return toAbsolute(url)
    const asset = resolveAsset?.(url)
    return asset ? (isAbsoluteUrl(asset) ? asset : toAbsolute(asset)) : undefined
  }

  const attribute = (node: JsxElement, name: string): string | undefined => {
    const attr = node.attributes.find((candidate) => candidate.type === "mdxJsxAttribute" && candidate.name === name)
    if (!attr) return undefined
    if (typeof attr.value === "string") return attr.value
    if (attr.value && typeof attr.value === "object") {
      const expression = attr.value.value.trim()
      return stringLiteral(expression) ?? (imports.has(expression) ? imports.get(expression) : undefined)
    }
    return undefined
  }

  const transformChildren = (children: AnyNode[]): RootContent[] => children.flatMap((child) => transformNode(child))

  const transformJsx = (node: JsxElement): RootContent[] => {
    const name = node.name ?? ""
    const children = () => transformChildren(node.children as AnyNode[])
    const phrasing = () => trimEdges(children() as PhrasingContent[])

    switch (name) {
      case "CollapsibleSection": {
        const title = attribute(node, "title")
        const heading: Heading[] = title ? [{ type: "heading", depth: 2, children: [{ type: "text", value: title }] }] : []
        return [...heading, ...children()]
      }
      case "CodePostAsset": {
        const fileName = attribute(node, "fileName")
        const asset = fileName ? codeAssets[fileName] : undefined
        if (!fileName || !asset) throw new Error(`<CodePostAsset> refers to a code asset that was not found: ${fileName ?? "(no fileName)"}`)
        return [{ type: "code", lang: attribute(node, "language") ?? null, value: asset.raw.replace(/\n+$/, "") }]
      }
      case "img": {
        // An image without alt text is decorative (the post's inline icons).
        const alt = attribute(node, "alt")
        const src = attribute(node, "src")
        const url = src ? resolveUrl(src) : undefined
        if (!alt || !url) return []
        return [{ type: "image", url, alt } satisfies Image]
      }
      case "a": {
        const href = attribute(node, "href")
        const url = href ? resolveUrl(href) : undefined
        return url ? [{ type: "link", url, children: phrasing() } satisfies Link] : children()
      }
      case "em":
      case "i":
        return [{ type: "emphasis", children: phrasing() }]
      case "strong":
      case "b":
        return [{ type: "strong", children: phrasing() }]
      case "del":
      case "s":
        return [{ type: "delete", children: phrasing() }]
      case "code":
        return [{ type: "inlineCode", value: phrasing().map((child) => ("value" in child ? child.value : "")).join("") }]
      case "br":
        return [{ type: "break" }]
      default:
        // Icons and other components with no content of their own vanish;
        // wrappers (div, span, custom components) keep what they contain.
        return children()
    }
  }

  const transformNode = (node: AnyNode): RootContent[] => {
    if (node.type === "yaml" || node.type === "mdxjsEsm") return []

    if (isExpression(node)) {
      const text = stringLiteral(node.value)
      return text === undefined ? [] : [{ type: "text", value: text }]
    }

    if (isJsx(node)) return transformJsx(node)

    if (node.type === "image") {
      const url = resolveUrl(node.url)
      return url ? [{ ...node, url }] : node.alt ? [{ type: "text", value: node.alt }] : []
    }

    if (node.type === "link") {
      const url = resolveUrl(node.url) ?? node.url
      return [{ ...node, url, children: transformChildren(node.children as AnyNode[]) as PhrasingContent[] }]
    }

    if (node.type === "heading") {
      return [{ ...node, children: trimEdges(transformChildren(node.children as AnyNode[]) as PhrasingContent[]) }]
    }

    if (hasChildren(node)) {
      const children = transformChildren(node.children as AnyNode[])
      // A paragraph that only held dropped JSX has nothing left to say.
      if (node.type === "paragraph" && children.length === 0) return []
      return [{ ...node, children } as RootContent]
    }

    return [node as RootContent]
  }

  const transformed: Root = { type: "root", children: transformChildren(root.children as AnyNode[]) }
  return serializer.stringify(transformed).trim()
}

export { transformMdxToMarkdown }
export type { MdxToMarkdownOptions }
