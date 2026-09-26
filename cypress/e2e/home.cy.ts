describe("home page", () => {
  it("loads and renders the header, recommendations, and latest posts", () => {
    cy.visit("/")

    cy.contains("h1", "Andrew Smith").should("be.visible")
    cy.contains("Staff Software Engineer").should("be.visible")

    cy.contains("Recommendations").should("be.visible")
    cy.contains("Latest Posts").should("be.visible")
  })

  it("shows exactly 3 recommendations, each with a name, title, and summary", () => {
    cy.visit("/")

    cy.contains("h2", "Recommendations")
      .closest("section")
      .find(".MuiCard-root")
      .should("have.length", 3)
      .each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(".MuiAvatar-img").should("have.attr", "alt").and("not.be.empty")
          cy.get(".MuiTypography-h3").invoke("text").should("not.be.empty")
          cy.get(".MuiChip-label").invoke("text").should("not.be.empty")
          cy.get(".MuiTypography-body-sm").invoke("text").should("not.be.empty")
          cy.get(".MuiTypography-body-md").first().invoke("text").should("not.be.empty")
        })
      })
  })

  it("shows exactly 3 latest posts, each with a category, date, title, and description", () => {
    cy.visit("/")

    cy.contains("h2", "Latest Posts")
      .closest("section")
      .find(".MuiCard-root")
      .should("have.length", 3)
      .each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(".MuiTypography-body-xs").first().invoke("text").should("not.be.empty")
          cy.get("time").invoke("text").should("not.be.empty")
          cy.get(".MuiTypography-h3").invoke("text").should("not.be.empty")
          cy.get(".MuiTypography-body-md").invoke("text").should("not.be.empty")
        })
      })
  })
})
