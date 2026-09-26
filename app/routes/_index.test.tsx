import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router"
import { describe, expect, it, vi } from "vitest"
import HomeRoute from "./_index"

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    useLoaderData: () => ({
      posts: [
        {
          code: "",
          slug: "my-post",
          frontmatter: { title: "My Post", description: "A description", category: "engineering", date: "2024-01-01" },
        },
      ],
    }),
  }
})

describe("home route", () => {
  it("renders without throwing, including the header and latest posts", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain("Andrew Smith")
    expect(html).toContain("Latest Posts")
    expect(html).toContain("My Post")
  })
})
