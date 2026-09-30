describe("recommendations page", () => {
  it("lists all 10 recommendations, each with a photo, name, employer, title, and summary", () => {
    cy.visit("/recommendations")

    cy.contains("h2", "Recommendations")
      .closest("section")
      .find(".MuiCard-root")
      .should("have.length", 10)
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

  it("puts the featured recommendations last by default and first with ?priority=featured", () => {
    cy.visit("/recommendations")
    cy.get(".MuiCard-root h3").first().should("have.text", "Keith Gargano")
    cy.get(".MuiCard-root h3").last().should("have.text", "Darnell Brown")

    cy.visit("/recommendations?priority=featured")
    cy.get(".MuiCard-root h3").first().should("have.text", "Denise Architetto")
  })

  it("opens the full recommendation from Read more", () => {
    cy.visit("/recommendations")

    cy.contains(".MuiCard-root", "Russell Thatcher").contains("button", "Read more").click()
    cy.get('[role="dialog"]').should("contain.text", "Russell Thatcher").and("contain.text", "top tier consultant")
  })

  it("publishes one Review per recommendation as JSON-LD", () => {
    cy.visit("/recommendations")

    cy.get('script[type="application/ld+json"]')
      .first()
      .then(($script) => {
        const jsonLd = JSON.parse($script.text())
        expect(jsonLd["@graph"]).to.have.length(10)
        expect(jsonLd["@graph"][0]).to.include({ "@type": "Review", "@id": "https://andrew.codes/recommendations#denise-architetto" })
        expect(jsonLd["@graph"][0].author).to.include({ name: "Denise Architetto" })
        expect(jsonLd["@graph"][0].author.worksFor).to.include({ name: "Microsoft" })
      })
  })
})
