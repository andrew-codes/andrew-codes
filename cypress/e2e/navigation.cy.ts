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

    // The back transition triggers a fetch for /_root.data before the
    // page re-renders, same as the forward transition above - wait on it
    // directly rather than racing defaultCommandTimeout.
    cy.intercept("GET", "**/_root.data").as("rootData")
    cy.go("back")
    cy.wait("@rootData")
    cy.location("pathname").should("eq", "/")
    cy.contains("h1", "Andrew Smith").should("be.visible")
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
