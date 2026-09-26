describe("primary navigation", () => {
  it("navigates from the home page to posts and back home", () => {
    cy.visit("/")

    // The forward transition triggers a fetch for /posts.data (plus its
    // lazy-loaded route chunk) before the page can render, and that fetch
    // can occasionally run longer than defaultCommandTimeout on a
    // resource-constrained CI runner. A cy.intercept/cy.wait pair was tried
    // here to synchronize on the request, but cy.wait races the request's
    // *start* against its own (tighter, 5s-default) requestTimeout, which
    // is a second flake source independent of the one below. Cypress
    // location/content assertions already retry until they time out, so
    // giving them a generous timeout directly - with no network
    // synchronization in between - removes both races.
    cy.contains("a", "Read my Posts").click()
    cy.location("pathname", { timeout: 20000 }).should("eq", "/posts")
    // /posts.data embeds every post's fully bundled MDX code, making it a
    // multi-megabyte payload - parsing and rendering it after the network
    // resolves can occasionally take longer than defaultCommandTimeout on a
    // CPU-constrained CI runner, so this assertion gets its own more
    // generous timeout instead of racing it.
    cy.contains("h2", "Featured", { timeout: 20000 }).should("be.visible")

    // The back transition triggers a fetch for /_root.data before the page
    // re-renders, same as the forward transition above - use the same
    // generous, retry-based assertion timeouts rather than an intercept.
    cy.go("back")
    cy.location("pathname", { timeout: 20000 }).should("eq", "/")
    cy.contains("h1", "Andrew Smith", { timeout: 20000 }).should("be.visible")
  })

  it("navigates from the home page to recommendations", () => {
    cy.visit("/")

    cy.contains("a", "View Recommendations").click()
    cy.location("pathname").should("eq", "/recommendations")
    cy.contains("h2", "Recommendations").should("be.visible")
  })

  it("navigates from an article to a different article via a shared tag, then back to the first article", () => {
    cy.visit("/")

    cy.contains("h2", "Latest Posts").closest("section").find(".MuiTypography-h3").first().click()

    cy.location("pathname").should("match", /^\/posts\/.+/)
    cy.get("article h2")
      .invoke("text")
      .then((firstArticleTitle) => {
        cy.location("pathname").then((firstArticlePath) => {
          cy.get("a[href^='/tags/']").first().click()
          cy.location("pathname").should("match", /^\/tags\/.+/)

          cy.get('a[href^="/posts/"]').not(`[href="${firstArticlePath}"]`).first().click()

          cy.location("pathname")
            .should("match", /^\/posts\/.+/)
            .and("not.eq", firstArticlePath)
          cy.get("article h2").invoke("text").should("not.eq", firstArticleTitle)

          cy.go("back")
          cy.location("pathname").should("match", /^\/tags\/.+/)

          cy.go("back")
          cy.location("pathname").should("eq", firstArticlePath)
          cy.get("article h2").invoke("text").should("eq", firstArticleTitle)
        })
      })
  })
})
