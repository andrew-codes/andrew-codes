// The generated resume outputs must never expose an email, phone or address.
const FORBIDDEN = [/[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i, /\b(mailto|tel):/i, /\+?\d[\d\s().-]{8,}\d/]

const expectNoContactDetails = (body: string) => {
  for (const pattern of FORBIDDEN) expect(body).not.to.match(pattern)
}

describe("resume for machines", () => {
  it("serves structured resume JSON", () => {
    cy.request("/agent/resume.json").then((response) => {
      expect(response.status).to.eq(200)
      const body = typeof response.body === "string" ? JSON.parse(response.body) : response.body
      expect(body.person.location).to.eq("Atlanta, GA")
      expect(body.experience[0].company.slug).to.eq("microsoft")
      expect(body.skills).to.have.length.greaterThan(0)
      expectNoContactDetails(JSON.stringify(body))
    })
  })

  it("serves the resume as markdown", () => {
    cy.request("/resume.md").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain("## Professional experience")
      expectNoContactDetails(response.body)
    })
  })
})
