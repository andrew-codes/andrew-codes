describe("connect page", () => {
  it("renders the header and QR code", () => {
    cy.visit("/connect")

    cy.contains("h1", "Andrew Smith").should("be.visible")
    cy.contains("Principal Software Engineer").should("be.visible")

    cy.get('[role="img"][aria-label*="QR code"]').should("be.visible").find("svg").should("exist")
  })
})
