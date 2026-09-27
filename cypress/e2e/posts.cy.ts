describe("posts", () => {
  it("renders the post list and opens a post's detail page", () => {
    cy.visit("/posts")

    cy.contains("h2", "All").should("be.visible")

    // Clicking "Read more" triggers a fetch for the post's .data file (plus
    // its lazy-loaded route chunk) before the detail page can render.
    // Against a live edge deployment, whether that fetch shows up as a
    // distinct network request cy.intercept can catch (vs. served from an
    // intermediate cache) isn't guaranteed the way it is on localhost, so
    // asserting on the rendered result directly - with headroom for a slow
    // fetch - is more reliable than waiting on the request (see the
    // equivalent reasoning in navigation.cy.ts).
    cy.get("a").contains("Read more").first().click()

    cy.location("pathname", { timeout: 20000 }).should("match", /^\/posts\/.+/)
    cy.get("article", { timeout: 20000 }).should("be.visible")
    cy.get("article h2").should("not.be.empty")
  })
})
