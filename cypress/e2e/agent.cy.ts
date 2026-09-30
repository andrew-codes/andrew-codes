const EMAIL = /[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i
const CONTACT_SCHEME = /mailto:|tel:/i

describe("/agent/recommendations.json", () => {
  it("serves the recommendations as JSON in the shared envelope", () => {
    cy.request("/agent/recommendations.json").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers["content-type"]).to.include("application/json")

      const { schema, generatedAt, canonical, data } = response.body
      expect(schema).to.eq("https://andrew.codes/agent/schema/v1")
      expect(generatedAt).to.match(/^\d{4}-\d{2}-\d{2}$/)
      expect(canonical).to.eq("https://andrew.codes/agent/recommendations.json")
      expect(data.recommendations).to.have.length(10)
      expect(data.recommendations[0]).to.deep.include({ id: "denise-architetto", featured: true })
      expect(data.recommendations[0].author).to.deep.include({
        name: "Denise Architetto",
        image: "https://andrew.codes/images/denise.jpeg",
        company: { slug: "microsoft", name: "Microsoft" },
      })
      expect(data.facets.company.calendly).to.deep.eq(["micah-prescott"])
    })
  })

  it("exposes no email or phone contact details", () => {
    cy.request("/agent/recommendations.json").then((response) => {
      const body = JSON.stringify(response.body)
      expect(body).not.to.match(EMAIL)
      expect(body).not.to.match(CONTACT_SCHEME)
    })
  })
})
