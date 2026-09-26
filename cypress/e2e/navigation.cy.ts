describe("primary navigation", () => {
  it("navigates from the home page to posts and back home", () => {
    cy.visit("/")

    // The forward transition triggers a fetch for /posts.data (plus its
    // lazy-loaded route chunk) before the page can render. On
    // resource-constrained CI runners that fetch can occasionally run
    // longer than defaultCommandTimeout, which previously made the
    // location/content assertions below race that fetch and time out.
    // Waiting on the request directly gives it its own (more generous)
    // cy.wait timeout instead of competing with the DOM assertions for
    // defaultCommandTimeout.
    cy.intercept("GET", "**/posts.data").as("postsData")
    cy.contains("a", "Read my Posts").click()
    cy.wait("@postsData")
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
