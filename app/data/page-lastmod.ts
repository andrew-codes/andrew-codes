// Last-modified dates for the pages whose content does not come from a post,
// used for sitemap <lastmod>. CI and deploy checkouts are shallow, so git
// history cannot be trusted at build time; these dates are committed instead,
// and a test (__tests__/page-lastmod.test.ts) fails when a page's source files
// change without this entry being updated. When it fails: set `lastmod` to
// the day of the content change and `hash` to the value the test prints.
type PageLastmod = {
  // YYYY-MM-DD of the last real content change.
  lastmod: string
  // Repo-relative files whose content is what the page renders.
  sources: readonly string[]
  // sha256 of those files' bytes, in order, at `lastmod`.
  hash: string
}

const pageLastmod: Readonly<Record<string, PageLastmod>> = {
  "/": {
    lastmod: "2026-11-19",
    sources: ["app/routes/_index.tsx", "app/data/profile.ts", "app/data/recommendations.ts", "app/public/images/andrew-smith.webp"],
    hash: "0fb8bc953df39d28ca8275c2fdb6ea9ad6440c6dbd5c7c690a4efa0639be663b",
  },
  "/recommendations": {
    lastmod: "2026-09-30",
    sources: ["app/routes/recommendations.tsx", "app/data/recommendations.ts"],
    hash: "a0d4c4fb55d4a0e4ded4d55c79b6238b82fa815364abe50be1765a1bc21a871e",
  },
  "/connect-with-me": {
    lastmod: "2026-09-30",
    sources: ["app/routes/connect-with-me.tsx", "app/data/profile.ts"],
    hash: "a27e4dc1c04d26998a46d05e4eb5dd03486709948e61b5ef834e4c6d57909892",
  },
}

export { pageLastmod }
export type { PageLastmod }
