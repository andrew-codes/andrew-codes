import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import PostCard from "../PostCard"
import type { MdxPage } from "../../types"

const post: MdxPage = {
  code: "",
  slug: "my-post",
  readTime: { text: "3 min read", minutes: 3, time: 180000, words: 600 },
  frontmatter: {
    title: "My Post",
    description: "A description",
    category: "engineering",
    date: "2024-01-01",
  },
}

const renderPostCard = (page: MdxPage) => {
  const Stub = createRoutesStub([{ path: "/", Component: () => <PostCard post={page} /> }])

  return renderToStaticMarkup(<Stub initialEntries={["/"]} />)
}

describe("PostCard", () => {
  it("renders the title, description, category, date, and read time", () => {
    const html = renderPostCard(post)

    expect(html).toContain("My Post")
    expect(html).toContain("A description")
    expect(html).toContain("engineering")
    expect(html).toContain("3 min read")
  })

  it("links to the post's detail page", () => {
    const html = renderPostCard(post)

    expect(html).toContain('href="/posts/my-post"')
  })

  it("omits the date when the post has none", () => {
    const html = renderPostCard({ ...post, frontmatter: { ...post.frontmatter, date: undefined } })

    expect(html).not.toContain("<time>")
  })
})
