// Every page has a markdown twin at its path with `.md` appended, indexed by
// /llms.txt and inlined in /llms-full.txt.
const EMAIL = /[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i
const CONTACT_SCHEME = /\b(mailto|tel):/i
const PHONE = /\+?\d[\d\s().-]{8,}\d/

// Post bodies carry ISO dates and URLs with commit hashes, both long runs of
// digits that would read as phone numbers, so those are masked for the phone
// check only.
const expectNoContactDetails = (body: string) => {
  expect(body).not.to.match(EMAIL)
  expect(body).not.to.match(CONTACT_SCHEME)
  expect(body.replace(/https?:\/\/[^\s)]+/g, "URL").replace(/\b\d{4}-\d{2}-\d{2}\b/g, "DATE")).not.to.match(PHONE)
}

// llms.txt links use the production origin; the suite serves the build locally.
const toLocalPath = (url: string) => new URL(url).pathname

describe("markdown twins", () => {
  it("serves a post as markdown at /posts/:id.md while /posts/:id stays the HTML page", () => {
    cy.request("/posts/devtools.md").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.match(/^# My Developer Workbench\n/)
      expect(response.body).to.contain("- Source: https://andrew.codes/posts/devtools/")
      expect(response.body).not.to.contain("<html")
    })
    cy.request("/posts/devtools/").then((response) => {
      expect(response.body).to.contain("<html")
    })
  })

  it("resolves a post's assets to files that exist, and drops imports and JSX", () => {
    cy.request("/posts/voice-assistant.md").then((response) => {
      expect(response.body).to.contain("## Trade-offs and Alternatives")
      expect(response.body).not.to.match(/^import /m)
      expect(response.body).not.to.contain("<CollapsibleSection")
      expect(response.body).not.to.contain("<SiAndroid")

      const images = [...response.body.matchAll(/!\[[^\]]*\]\((https:\/\/andrew\.codes\/files\/[^)]+)\)/g)].map((match) => toLocalPath(match[1]))
      expect(images).to.have.length.greaterThan(0)
      for (const image of images) cy.request(image).its("status").should("eq", 200)
    })
  })

  it("inlines a post's code asset as a fenced code block", () => {
    cy.request("/posts/devtools.md").then((response) => {
      expect(response.body).not.to.contain("<CodePostAsset")
      expect(response.body).to.contain("readarray -t extensions < <(code --list-extensions)")
    })
  })

  it("serves tags, the posts index, the home page and recommendations as markdown", () => {
    cy.request("/tags/home%20assistant.md").its("body").should("contain", "# Posts tagged \"home assistant\"")
    cy.request("/posts.md").its("body").should("contain", "# Posts by Andrew Smith")
    cy.request("/index.md").its("body").should("match", /^# Andrew Smith\n/)
    cy.request("/recommendations.md").then((response) => {
      expect(response.body).to.contain("## Denise Architetto")
      expect(response.body).to.contain("Microsoft")
    })
  })

  it("advertises each twin in the head of its page", () => {
    const pages: Record<string, string> = {
      "/": "/index.md",
      "/posts": "/posts.md",
      "/posts/devtools": "/posts/devtools.md",
      "/tags/home assistant": "/tags/home%20assistant.md",
      "/recommendations": "/recommendations.md",
    }
    for (const [page, twin] of Object.entries(pages)) {
      cy.visit(page)
      cy.get('head link[rel="alternate"][type="text/markdown"]').should("have.attr", "href", `https://andrew.codes${twin}`)
    }
  })
})

describe("llms.txt", () => {
  it("indexes the site with links that all resolve", () => {
    cy.request("/llms.txt").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.match(/^# Andrew Smith\n\n> /)

      const twins = [...response.body.matchAll(/\]\((https:\/\/andrew\.codes\/[^)]+)\)/g)].map((match) => toLocalPath(match[1]))
      expect(twins).to.include("/posts/devtools.md")
      expect(twins).to.include("/resume.md")
      for (const twin of twins) cy.request(twin).its("status").should("eq", 200)
    })
  })

  it("serves llms-full.txt with the resume, recommendations and every post", () => {
    cy.request("/llms-full.txt").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain("# James Andrew Smith - Resume")
      expect(response.body).to.contain("# Recommendations")
      expect(response.body).to.contain("# Custom Voice Assistant")
      expect(response.body).to.contain("# Software Craftsmanship")
    })
  })

  it("never exposes an email, phone number or address", () => {
    for (const path of ["/llms.txt", "/llms-full.txt", "/index.md", "/posts.md", "/recommendations.md", "/posts/devtools.md", "/posts/voice-assistant.md"]) {
      cy.request(path).then((response) => expectNoContactDetails(response.body))
    }
  })
})
