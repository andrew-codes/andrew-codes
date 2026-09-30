// Privacy regression gate: scans every text artifact in the build output
// (HTML pages, JSON-LD, /agent JSON, robots.txt, sitemap, feed, markdown,
// llms.txt and anything added later) for email, phone and address details.
describe("privacy", () => {
  it("keeps contact details out of every built artifact", () => {
    cy.task<{ scanned: string[]; violations: string[] } | null>("scanBuildForPrivacy", "build/client").then((result) => {
      // No local build to read (Cloudflare preview run); the next test covers that.
      if (!result) return
      const { scanned, violations } = result
      expect(scanned.length, "artifacts scanned").to.be.greaterThan(40)
      expect(violations).to.deep.eq([])
    })
  })

  it("serves the machine-facing files without contact details", () => {
    for (const path of ["/robots.txt", "/sitemap.xml", "/feed.xml", "/agent/resume.json", "/agent/posts.json", "/agent/projects.json"]) {
      cy.request(path).then((response) => {
        const body = typeof response.body === "string" ? response.body : JSON.stringify(response.body)
        expect(body, path).not.to.match(/[^\s@"'<>]+@[^\s@"'<>]+\.[a-z]{2,}/i)
        expect(body, path).not.to.match(/\b(mailto|tel):/i)
        expect(body, path).not.to.match(/\.pdf\b/i)
      })
    }
  })
})
