describe("crawler files", () => {
  it("serves a robots.txt that allows search, agents and training and names the sitemap", () => {
    cy.request("/robots.txt").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain("Content-Signal: search=yes, ai-input=yes, ai-train=yes")
      expect(response.body).to.contain("Sitemap: https://andrew.codes/sitemap.xml")
      expect(response.body).not.to.match(/^Disallow:/m)
    })
  })

  it("serves a sitemap with lastmod dates from post front matter", () => {
    cy.request("/sitemap.xml").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.match(/<loc>https:\/\/andrew\.codes\/posts\/devtools<\/loc>\s*<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
      expect(response.body).to.contain("<loc>https://andrew.codes/tags/home-assistant</loc>")
    })
  })

  it("serves an Atom feed of the posts", () => {
    cy.request("/feed.xml").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain(`<feed xmlns="http://www.w3.org/2005/Atom">`)
      expect(response.body).to.contain("<id>https://andrew.codes/posts/devtools</id>")
    })
  })

  it("advertises the feed in the head of every page", () => {
    for (const path of ["/", "/posts", "/posts/devtools", "/connect-with-me"]) {
      cy.visit(path)
      cy.get('head link[rel="alternate"][type="application/atom+xml"]').should("have.attr", "href", "/feed.xml")
    }
  })
})
