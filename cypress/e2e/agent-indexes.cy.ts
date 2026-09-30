// Post and project indexes for machines. Like the resume outputs, they must
// never expose an email, phone or address (ISO dates are masked: they look like
// numbers to the phone pattern).
const FORBIDDEN = [/[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i, /\b(mailto|tel):/i, /\+?\d[\d\s().-]{8,}\d/]

const expectNoContactDetails = (body: string) => {
  const masked = body.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE")
  for (const pattern of FORBIDDEN) expect(masked).not.to.match(pattern)
}

const json = (body: unknown) => (typeof body === "string" ? JSON.parse(body) : body) as any

describe("post and project indexes for machines", () => {
  it("serves every post with facets, and featured as a flag rather than a tag", () => {
    cy.request("/agent/posts.json").then((response) => {
      expect(response.status).to.eq(200)
      const body = json(response.body)

      const devtools = body.posts.find((post: any) => post.slug === "devtools-declared")
      expect(devtools.url).to.eq("https://andrew.codes/posts/devtools-declared")
      expect(devtools.featured).to.eq(true)
      expect(devtools.tags).not.to.include("featured")
      expect(devtools.projects).to.include("devtools")
      expect(devtools.technologies).to.include("ansible")

      expect(body.facets.topic.ai).to.include("workflow-delegated")
      expect(body.facets.tag.agents).to.deep.eq(["workflow-delegated"])
      expect(body.facets.project.devtools).to.include("devtools-revisited")
      expect(body.topics).to.deep.include({ slug: "home-assistant", label: "Home Assistant" })
      expectNoContactDetails(JSON.stringify(body))
    })
  })

  it("serves projects apart from technologies I use, each linking back to its posts", () => {
    cy.request("/agent/projects.json").then((response) => {
      expect(response.status).to.eq(200)
      const body = json(response.body)

      const forecast = body.projects.find((project: any) => project.slug === "forecast-work-oss")
      expect(forecast.role).to.eq("creator")
      expect(forecast.repo).to.eq("https://github.com/andrew-codes/forecast-work-oss")
      expect(forecast.posts[0].url).to.eq("https://andrew.codes/posts/agile-forecasting")

      expect(body.projects.map((project: any) => project.slug)).not.to.include("firstmate")
      expect(body.technologiesIUse.map((project: any) => project.slug)).to.include.members(["firstmate", "ansible"])
      expect(body.technologiesIUse.every((project: any) => project.role === "user")).to.eq(true)
      expectNoContactDetails(JSON.stringify(body))
    })
  })
})
