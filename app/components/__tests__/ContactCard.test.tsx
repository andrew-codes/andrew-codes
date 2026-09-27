import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ConnectionList, ContactCard, FullName, JobTitle, Url } from "../ContactCard"

describe("ContactCard", () => {
  it("renders as an hCard with the vcard class", () => {
    const html = renderToStaticMarkup(
      <ContactCard>
        <FullName>Andrew Smith</FullName>
      </ContactCard>,
    )

    expect(html).toContain('class="vcard')
    expect(html).toContain("Andrew Smith")
  })

  it("marks the full name and job title with their microformat classes", () => {
    const html = renderToStaticMarkup(
      <>
        <FullName>Andrew Smith</FullName>
        <JobTitle>Staff Software Engineer</JobTitle>
      </>,
    )

    expect(html).toContain('class="fn')
    expect(html).toContain('class="title')
  })

  it("separates connection list entries after the first with a divider", () => {
    const html = renderToStaticMarkup(
      <ConnectionList>
        <Url href="https://linkedin.com/in/example">LinkedIn</Url>
        <Url href="https://github.com/example">GitHub</Url>
      </ConnectionList>,
    )

    expect(html).toContain("∙")
    expect(html).toContain("LinkedIn")
    expect(html).toContain("GitHub")
  })
})
