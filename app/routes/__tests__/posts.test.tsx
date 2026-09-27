import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router"
import { describe, expect, it, vi } from "vitest"
import PostsRoute from "../posts"

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    useLoaderData: () => ({
      posts: [
        {
          code: "",
          slug: "featured-post",
          frontmatter: { title: "Featured Post", description: "A description", category: "engineering", date: "2024-02-01", tags: ["featured"] },
        },
        {
          code: "",
          slug: "other-post",
          frontmatter: { title: "Other Post", description: "Another description", category: "agility", date: "2024-01-01" },
        },
      ],
    }),
  }
})

describe("posts route", () => {
  it("renders without throwing, listing featured and all posts", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/posts"]}>
        <Routes>
          <Route path="/posts" element={<PostsRoute />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain("Featured")
    expect(html).toContain("All")
    expect(html).toContain("Featured Post")
    expect(html).toContain("Other Post")
  })
})
