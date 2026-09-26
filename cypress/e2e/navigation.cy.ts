describe("primary navigation", () => {
  it("navigates from the home page to posts and back home", () => {
    cy.visit("/")

    cy.contains("a", "Read my Posts").click()
    cy.location("pathname").should("eq", "/posts")
    cy.contains("h2", "Featured").should("be.visible")

    cy.go("back")
    cy.location("pathname").should("eq", "/")
    cy.contains("h1", "Andrew Smith").should("be.visible")
  })

  it("navigates from the home page to recommendations", () => {
    cy.visit("/")

    cy.contains("a", "View Recommendations").click()
    cy.location("pathname").should("eq", "/recommendations")
    cy.contains("h2", "Recommendations").should("be.visible")
  })
})
