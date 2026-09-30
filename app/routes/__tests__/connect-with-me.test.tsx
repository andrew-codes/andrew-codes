import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import { socialLinks } from "../../data/profile"
import ConnectWithMeRoute, { meta } from "../connect-with-me"

const renderPage = () => {
  const Stub = createRoutesStub([{ path: "/connect-with-me", Component: ConnectWithMeRoute }])

  return renderToStaticMarkup(<Stub initialEntries={["/connect-with-me"]} />)
}

const stripStyleBlocks = (html: string) => {
  let rest = html
  let out = ""

  for (let start = rest.indexOf("<style"); start !== -1; start = rest.indexOf("<style")) {
    const end = rest.indexOf("</style>", start)

    out += rest.slice(0, start)
    rest = end === -1 ? "" : rest.slice(end + "</style>".length)
  }

  return out + rest
}

describe("connect-with-me route", () => {
  it("links to LinkedIn and GitHub in a new tab", () => {
    const html = renderPage()

    expect(html).toContain('href="https://linkedin.com/in/JamesAndrewSmith"')
    expect(html).toContain('href="https://github.com/andrew-codes"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it("renders every shared social link", () => {
    const html = renderPage()

    for (const link of socialLinks) {
      expect(html).toContain(`href="${link.url}"`)
    }
  })

  it("offers to view the resume, then recommendations, instead of a connect link", () => {
    const html = renderPage()

    expect(html).not.toContain("Download Resume")
    expect(html.indexOf("View Resume")).toBeGreaterThan(-1)
    expect(html.indexOf("View Recommendations")).toBeGreaterThan(html.indexOf("View Resume"))
    expect(html).toContain('href="/recommendations?priority=featured"')
    expect(html).not.toContain("Connect / Resume")
    expect(html).not.toContain('href="/connect-with-me"')
  })

  it("exposes no email, phone, or address on the page or in its metadata", () => {
    // Emotion inlines <style> blocks full of digits; only the visible markup matters here.
    const content = stripStyleBlocks(renderPage()) + JSON.stringify(meta({} as any))

    expect(content).not.toMatch(/mailto:/i)
    expect(content).not.toMatch(/tel:/i)
    expect(content).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/)
    expect(content).not.toMatch(/\+?\d[\d\s().-]{8,}\d/)
    expect(content).not.toMatch(/<address/i)
    expect(content).not.toMatch(/\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln)\b/i)
  })
})
