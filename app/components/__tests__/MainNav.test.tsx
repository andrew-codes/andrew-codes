import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import GlobalNav from "../MainNav"

describe("MainNav", () => {
  it("renders the site owner's identity and links to home and the resume", () => {
    const Stub = createRoutesStub([{ path: "/", Component: () => <GlobalNav /> }])

    const html = renderToStaticMarkup(<Stub initialEntries={["/"]} />)

    expect(html).toContain("James Andrew Smith")
    expect(html).toContain("Staff Software Engineer")
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/resume"')
  })

  it("links out to LinkedIn and GitHub profiles", () => {
    const Stub = createRoutesStub([{ path: "/", Component: () => <GlobalNav /> }])

    const html = renderToStaticMarkup(<Stub initialEntries={["/"]} />)

    expect(html).toContain('href="https://linkedin.com/in/JamesAndrewSmith"')
    expect(html).toContain('href="https://github.com/andrew-codes"')
  })
})
