import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router"
import { describe, expect, it, vi } from "vitest"
import PostRoute from "../posts.$id"

vi.mock("mdx-bundler/client", () => ({
  getMDXComponent: () => () => <div data-testid="mdx-body">Mock post body</div>,
}))

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    useLoaderData: () => ({
      code: "",
      slug: "my-post",
      frontmatter: {
        title: "My Post",
        category: "engineering",
        date: "2024-01-01",
        tags: ["engineering"],
      },
      readTime: { text: "3 min read", minutes: 3, time: 180000, words: 600 },
      codeAssets: {},
    }),
  }
})

describe("post detail route", () => {
  it("renders without throwing, including the title, date, tags, and compiled body", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/posts/my-post"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostRoute />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain("My Post")
    expect(html).toContain("3 min read")
    expect(html).toContain("mdx-body")
  })
})
