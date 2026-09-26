import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import RecommendationsRoute from "./recommendations"

describe("recommendations route", () => {
  it("renders without throwing", () => {
    const Stub = createRoutesStub([{ path: "/recommendations", Component: RecommendationsRoute }])

    const html = renderToStaticMarkup(<Stub initialEntries={["/recommendations"]} />)

    expect(html).toContain("Recommendations")
  })

  it("prioritizes featured recommendations when the priority query param is set", () => {
    const Stub = createRoutesStub([{ path: "/recommendations", Component: RecommendationsRoute }])

    const html = renderToStaticMarkup(<Stub initialEntries={["/recommendations?priority=featured"]} />)

    expect(html.indexOf("Denise Architetto")).toBeLessThan(html.indexOf("Keith Gargano"))
  })

  it("does not prioritize featured recommendations when the priority query param is absent", () => {
    const Stub = createRoutesStub([{ path: "/recommendations", Component: RecommendationsRoute }])

    const html = renderToStaticMarkup(<Stub initialEntries={["/recommendations"]} />)

    expect(html.indexOf("Keith Gargano")).toBeLessThan(html.indexOf("Denise Architetto"))
  })
})
