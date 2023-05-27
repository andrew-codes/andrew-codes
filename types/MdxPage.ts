import type calculateReadingTime from "reading-time"
import type { Category } from "./Categories"

type MdxPageFile = {
  fileName: string
  slug: string
  filePath: string
}

type MdxPage = {
  code: string
  slug: string
  readTime?: ReturnType<typeof calculateReadingTime>
  codeAssets?: Record<string, string>

  frontmatter: {
    title?: string
    description?: string
    meta?: {
      keywords?: Array<string>
    }
    category: Category
    tags?: Array<string>
    date?: string
  }
}

type MdxListItem = Omit<MdxPage, "code" | "codeAssets">

export type { MdxPage, MdxListItem, MdxPageFile }
