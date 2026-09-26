describe("posts", () => {
  it("renders the post list and opens a post's detail page", () => {
    cy.visit("/posts")

    cy.contains("h2", "All").should("be.visible")

    // Clicking "Read more" triggers a fetch for the post's .data file (plus
    // its lazy-loaded route chunk) before the detail page can render. On
    // resource-constrained CI runners that fetch can occasionally run
    // longer than defaultCommandTimeout, which previously made the
    // location/content assertions below race that fetch and time out (see
    // the equivalent wait in navigation.cy.ts). Waiting on the request
    // directly gives it its own timeout instead of competing with the DOM
    // assertions for defaultCommandTimeout.
    cy.intercept("GET", "**/posts/*.data").as("postData")
    cy.get("a").contains("Read more").first().click()
    cy.wait("@postData")

    cy.location("pathname").should("match", /^\/posts\/.+/)
    cy.get("article").should("be.visible")
    cy.get("article h2").should("not.be.empty")
  })
})
