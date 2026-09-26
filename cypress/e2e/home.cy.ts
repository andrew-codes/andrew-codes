describe("home page", () => {
  it("loads and renders the header, recommendations, and latest posts", () => {
    cy.visit("/")

    cy.contains("h1", "Andrew Smith").should("be.visible")
    cy.contains("Staff Software Engineer").should("be.visible")

    cy.contains("Recommendations").should("be.visible")
    cy.contains("Latest Posts").should("be.visible")
  })
})
