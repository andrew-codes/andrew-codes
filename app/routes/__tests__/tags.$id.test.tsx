import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter, Route, Routes } from "react-router"
import { describe, expect, it, vi } from "vitest"
import type { MdxListItem } from "../../types"
import TagsRoute, { loader } from "../tags.$id"

const listItems = vi.hoisted(() => ({ current: [] as MdxListItem[] }))

vi.mock("../../libs/mdx.server", () => ({ getMdxListItems: async () => listItems.current }))

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

describe("tags route loader", () => {
  const post = (slug: string, date: string, tags: string[]): MdxListItem => ({ slug, frontmatter: { title: slug, category: "engineering", date, tags } })
  const load = (id: string) => loader({ request: new Request("http://localhost/tags/x"), params: { id }, context: {} } as unknown as Parameters<typeof loader>[0])

  it("lists the posts of a topic, whichever tag spelling they use, newest first", async () => {
    listItems.current = [post("agents-post", "2026-01-01", ["agents"]), post("ai-post", "2026-06-01", ["ai"]), post("other", "2026-03-01", ["nix"])]

    const { posts, topic } = await load("ai")

    expect(posts.map((candidate) => candidate.slug)).toEqual(["ai-post", "agents-post"])
    expect(topic).toEqual({ slug: "ai", label: "AI" })
  })

  it("serves a topic derived from a tag that is not in the curated list", async () => {
    listItems.current = [post("one", "2026-01-01", ["Brand New Tag"])]

    const { posts, topic } = await load("brand-new-tag")

    expect(posts.map((candidate) => candidate.slug)).toEqual(["one"])
    expect(topic).toEqual({ slug: "brand-new-tag", label: "Brand New Tag" })
  })

  it("has no posts for an unknown topic, without failing", async () => {
    listItems.current = [post("one", "2026-01-01", ["nix"])]

    expect(await load("nope")).toEqual({ topic: { slug: "nope", label: "nope" }, posts: [] })
  })
})
