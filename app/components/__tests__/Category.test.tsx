import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Header } from "../Category"

describe("Category Header", () => {
  it("uses white text on a category's colored gradient background", () => {
    const html = renderToStaticMarkup(<Header category="engineering">content</Header>)

    expect(html).toContain("rgb(255, 255, 255)")
  })

  it("uses black text on a white background when there is no category", () => {
    const html = renderToStaticMarkup(<Header category={undefined}>content</Header>)

    expect(html).toContain("rgb(0,0,0)")
  })
})
