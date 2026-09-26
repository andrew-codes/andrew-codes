import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router"
import { describe, expect, it, vi } from "vitest"
import TagsRoute from "./tags.$id"

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    useLoaderData: () => ({
      posts: [
        {
          code: "",
          slug: "my-post",
          frontmatter: { title: "My Post", description: "A description", category: "engineering", date: "2024-01-01", tags: ["engineering"] },
        },
      ],
    }),
  }
})

describe("tags route", () => {
  it("renders without throwing, listing the posts for that tag", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/tags/engineering"]}>
        <Routes>
          <Route path="/tags/:id" element={<TagsRoute />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain("My Post")
  })
})
