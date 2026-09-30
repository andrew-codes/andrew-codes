// Where each markdown twin lives. A twin sits at its page's path with `.md`
// appended (`/posts/x` -> `/posts/x.md`), which is the convention llms.txt
// consumers expect. Pages that already end in a slash-less path map one to one;
// the home page has no file name, so its twin is `/index.md`.

const markdownPaths = {
  home: "/index.md",
  posts: "/posts.md",
  recommendations: "/recommendations.md",
  resume: "/resume.md",
  llms: "/llms.txt",
  llmsFull: "/llms-full.txt",
  post: (slug: string) => `/posts/${slug}.md`,
  tag: (tag: string) => `/tags/${tag}.md`,
} as const

// Twins that exist once, whatever the posts are.
const FIXED_MARKDOWN_PATHS = [markdownPaths.home, markdownPaths.posts, markdownPaths.recommendations] as const

export { FIXED_MARKDOWN_PATHS, markdownPaths }
