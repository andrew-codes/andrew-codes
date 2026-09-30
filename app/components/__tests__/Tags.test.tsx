import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import Tags from "../Tags"

const renderTags = (tags: string[]) => {
  const Stub = createRoutesStub([{ path: "/", Component: () => <Tags tags={tags} /> }])

  return renderToStaticMarkup(<Stub initialEntries={["/"]} />)
}

describe("Tags", () => {
  it("renders a link to each tag's page", () => {
    const html = renderTags(["engineering", "agility"])

    expect(html).toContain('href="/tags/engineering"')
    expect(html).toContain('href="/tags/agility"')
  })

  it("links a tag to its topic page and shows the tag as authored", () => {
    const html = renderTags(["home assistant", "agents", "Brand New Tag"])

    expect(html).toContain('href="/tags/home-assistant"')
    expect(html).toContain(">home assistant<")
    expect(html).toContain('href="/tags/ai"')
    expect(html).toContain('href="/tags/brand-new-tag"')
    expect(html).toContain(">Brand New Tag<")
  })

  it("separates tags after the first with a divider", () => {
    const html = renderTags(["one", "two", "three"])

    const dividerCount = html.split("∙").length - 1
    expect(dividerCount).toBe(2)
  })

  it("renders no divider for a single tag", () => {
    const html = renderTags(["solo"])

    expect(html).not.toContain("∙")
  })
})
