import { renderToStaticMarkup } from "react-dom/server"
import QRCode from "qrcode"
import { describe, expect, it } from "vitest"
import { ConnectPageContent, LINKEDIN_PROFILE_URL, loader } from "../connect"

describe("connect route", () => {
  it("renders Andrew Smith as the page header", async () => {
    const qrCodeSvg = await QRCode.toString(LINKEDIN_PROFILE_URL, {
      type: "svg",
      margin: 1,
    })

    const html = renderToStaticMarkup(<ConnectPageContent qrCodeSvg={qrCodeSvg} />)

    expect(html).toContain("Andrew Smith")
  })

  it("renders the headshot above the name", async () => {
    const qrCodeSvg = await QRCode.toString(LINKEDIN_PROFILE_URL, {
      type: "svg",
      margin: 1,
    })

    const html = renderToStaticMarkup(<ConnectPageContent qrCodeSvg={qrCodeSvg} />)

    expect(html).toContain("/images/andrew-smith.webp")
  })

  it("renders the subtitle as two lines: title, then company", async () => {
    const qrCodeSvg = await QRCode.toString(LINKEDIN_PROFILE_URL, {
      type: "svg",
      margin: 1,
    })

    const html = renderToStaticMarkup(<ConnectPageContent qrCodeSvg={qrCodeSvg} />)

    expect(html).toContain("Principal Software Engineer")
    expect(html).toContain("@ Atlassian")
  })

  it("loads a QR code that encodes the LinkedIn profile URL", async () => {
    const { qrCodeSvg } = await loader({} as any)
    const expectedSvg = await QRCode.toString(LINKEDIN_PROFILE_URL, {
      type: "svg",
      margin: 1,
    })

    expect(qrCodeSvg).toBe(expectedSvg)
  })

  it("renders the loaded QR code as an svg", async () => {
    const { qrCodeSvg } = await loader({} as any)

    const html = renderToStaticMarkup(<ConnectPageContent qrCodeSvg={qrCodeSvg} />)

    expect(html).toContain("<svg")
  })
})

describe("connect route (conference QR page) is unaffected by connect-with-me", () => {
  it("does not render the call to action or link to connect-with-me", async () => {
    const { qrCodeSvg } = await loader({} as any)

    const html = renderToStaticMarkup(<ConnectPageContent qrCodeSvg={qrCodeSvg} />)

    expect(html).not.toContain("Connect / Resume")
    expect(html).not.toContain("connect-with-me")
    expect(html).toContain("QR code linking to Andrew Smith")
  })
})
