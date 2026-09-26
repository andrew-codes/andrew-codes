import { renderToStaticMarkup } from "react-dom/server"
import { createRoutesStub } from "react-router"
import { describe, expect, it } from "vitest"
import CallToAction from "./CallToAction"

const renderCta = (props: React.ComponentProps<typeof CallToAction>) => {
  const Stub = createRoutesStub([{ path: "/", Component: () => <CallToAction {...props} /> }])

  return renderToStaticMarkup(<Stub initialEntries={["/"]} />)
}

describe("CallToAction", () => {
  it("defaults the primary action to downloading the resume", () => {
    const html = renderCta({ secondaryTitle: "Secondary", secondaryAction: "/secondary" })

    expect(html).toContain("Download Resume")
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
