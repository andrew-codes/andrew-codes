describe("posts", () => {
  it("renders the post list and opens a post's detail page", () => {
    cy.visit("/posts")

    cy.contains("h2", "All").should("be.visible")

    cy.get("a").contains("Read more").first().click()

    cy.location("pathname").should("match", /^\/posts\/.+/)
    cy.get("article").should("be.visible")
    cy.get("article h2").should("not.be.empty")
  })
})
