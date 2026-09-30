describe("connect with me page", () => {
  it("is reachable from the Connect / Resume button on the home page", () => {
    cy.visit("/")

    cy.contains("a", "Connect / Resume").should("have.attr", "href", "/connect-with-me")
    cy.contains("a", "Connect / Resume").click()
    cy.location("pathname", { timeout: 20000 }).should("eq", "/connect-with-me")
    cy.contains("h2", "Connect with Me").should("be.visible")
  })

  it("links to LinkedIn and GitHub and offers the resume instead of a connect link", () => {
    cy.visit("/connect-with-me")

    cy.contains("a", "Connect on LinkedIn").should("have.attr", "href", "https://linkedin.com/in/JamesAndrewSmith")
    cy.contains("a", "Follow on GitHub").should("have.attr", "href", "https://github.com/andrew-codes")
    cy.contains("a", "Download Resume").should("not.exist")
    cy.contains("a", "View Resume").should("be.visible").and("have.attr", "target", "_blank")
    cy.contains("a", "View Recommendations").should("have.attr", "href", "/recommendations?priority=featured")
    cy.contains("Connect / Resume").should("not.exist")
  })

  it("does not expose an email, phone, or address", () => {
    cy.visit("/connect-with-me")

    cy.get('a[href^="mailto:"], a[href^="tel:"], address').should("not.exist")
  })

  it("leaves the conference /connect page untouched", () => {
    cy.visit("/connect")

    cy.get('[role="img"][aria-label*="QR code"]').should("be.visible")
    cy.contains("Connect / Resume").should("not.exist")
  })
})
