type SitemapEntry = {
  route: string
  lastmod?: string
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
  priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
}
type Handle = {
  /** this just allows us to identify routes more directly rather than relying on pathnames */
  id?: string
  getSitemapEntries?: (
    request: Request,
  ) =>
    | Promise<Array<SitemapEntry | null> | null>
    | Array<SitemapEntry | null>
    | null
}

export type { Handle, SitemapEntry }
export * from "./configuration"
export * from "./Categories"
export * from "./MdxPage"
