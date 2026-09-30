import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import CallToAction from "../CallToAction"

const renderCta = (props: React.ComponentProps<typeof CallToAction>) => {
  const Stub = createRoutesStub([{ path: "/", Component: () => <CallToAction {...props} /> }])

  return renderToStaticMarkup(<Stub initialEntries={["/"]} />)
}

describe("CallToAction", () => {
  it("defaults the primary action to a Connect / Resume link to /connect-with-me", () => {
    const html = renderCta({ secondaryTitle: "Secondary", secondaryAction: "/secondary" })

    expect(html).toContain("Connect / Resume")
    expect(html).toContain('href="/connect-with-me"')
  })

  it("offers download and view resume, and no link to itself, on the connect variant", () => {
    const html = renderCta({ variant: "connect", secondaryTitle: "Secondary", secondaryAction: "/secondary" })

    expect(html).toContain("Download Resume")
    expect(html).toContain("View Resume")
    expect(html).not.toContain("Connect / Resume")
    expect(html).not.toContain("Connect with Me")
    expect(html).not.toContain('href="/connect-with-me"')
    expect(html).toContain('target="_blank"')
  })

  it("renders a custom primary action as a link when given a path", () => {
    const html = renderCta({
      primaryTitle: "Primary",
      primaryAction: "/primary",
      secondaryTitle: "Secondary",
      secondaryAction: "/secondary",
    })

    expect(html).toContain("Primary")
    expect(html).toContain('href="/primary"')
  })

  it("renders the secondary and tertiary actions as links", () => {
    const html = renderCta({
      secondaryTitle: "Secondary",
      secondaryAction: "/secondary",
      tertiaryTitle: "Tertiary",
      tertiaryAction: "/tertiary",
    })

    expect(html).toContain('href="/secondary"')
    expect(html).toContain('href="/tertiary"')
  })

  it("omits the tertiary action entirely when not provided", () => {
    const html = renderCta({ secondaryTitle: "Secondary", secondaryAction: "/secondary" })

    expect(html).not.toContain("Tertiary")
  })
})
