import type calculateReadingTime from "reading-time"
import type { Category } from "./Categories"
import type { ProjectReference } from "./Projects"

type MdxPageFile = {
  fileName: string
  slug: string
  filePath: string
}

type MdxPage = {
  code: string
  slug: string
  readTime?: ReturnType<typeof calculateReadingTime>
  codeAssets?: Record<string, { raw: string; highlightedHtml: string }>

  frontmatter: {
    title?: string
    description?: string
    meta?: {
      keywords?: Array<string>
    }
    category: Category
    tags?: Array<string>
    date?: string
    // Surfaces the post in the featured section of the posts page.
    featured?: boolean
    // Projects and technologies the post is about; see app/posts/AGENTS.md.
    projects?: Array<ProjectReference>
    // Company slugs (app/data/resume.ts) the post is about or drew from.
    companies?: Array<string>
  }
}

type MdxListItem = Omit<MdxPage, "code" | "codeAssets">

export type { MdxPage, MdxListItem, MdxPageFile }
