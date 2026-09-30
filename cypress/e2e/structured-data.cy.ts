// Asserts on the prerendered HTML itself (cy.request), not the hydrated DOM:
// crawlers and agents read the static <head> and never run the app.

const ORIGIN = "https://andrew.codes"
const PERSON_ID = `${ORIGIN}/#me`

// The site owner's contact details must never appear in structured data.
const FORBIDDEN = [/[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i, /\b(mailto|tel):/i, /"(email|telephone|address|contactPoint)"/]

// Takes a callback rather than yielding the blocks: Cypress wraps yielded DOM
// values in jQuery, which would hide the plain objects used below.
const withJsonLd = (path: string, assertions: (blocks: Record<string, any>[]) => void) =>
  cy.request(path).then((response) => {
    const doc = new DOMParser().parseFromString(response.body as string, "text/html")
    const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
    const blocks = scripts.map((script) => JSON.parse(script.textContent ?? ""))

    for (const script of scripts) {
      for (const pattern of FORBIDDEN) expect(script.textContent).not.to.match(pattern)
    }
    assertions(blocks)
  })

describe("JSON-LD in the built HTML", () => {
  it("describes the site owner on the home page as a ProfilePage with a Person", () => {
    withJsonLd("/", (blocks) => {
      expect(blocks, "one block").to.have.length(1)
      const [profilePage] = blocks

      expect(profilePage["@context"]).to.eq("https://schema.org")
      expect(profilePage["@type"]).to.eq("ProfilePage")
      expect(profilePage.url).to.eq(`${ORIGIN}/`)

      const person = profilePage.mainEntity
      expect(person["@type"]).to.eq("Person")
      expect(person["@id"]).to.eq(PERSON_ID)
      expect(person.name).to.eq("James Andrew Smith")
      expect(person.jobTitle).to.eq("Staff Software Engineer")
      expect(person.image).to.eq(`${ORIGIN}/images/andrew-smith.webp`)
      expect(person.sameAs).to.include("https://github.com/andrew-codes")
      expect(person.knowsAbout).to.include("React.js")
      expect(person.worksFor["@type"]).to.eq("Organization")
    })
  })

  it("describes a post as a BlogPosting authored by the home page Person", () => {
    withJsonLd("/posts/devtools-declared/", (blocks) => {
      expect(blocks, "one block").to.have.length(1)
      const [posting] = blocks

      expect(posting["@type"]).to.eq("BlogPosting")
      expect(posting.headline).to.eq("My Developer Workbench, Declared")
      expect(posting.description).to.contain("Nix")
      expect(posting.url).to.eq(`${ORIGIN}/posts/devtools-declared/`)
      expect(posting.datePublished).to.eq("2026-08-10")
      expect(posting.articleSection).to.eq("engineering")
      expect(posting.keywords).to.deep.eq(["devtools", "automation", "nix", "zsh", "ansible"])
      expect(posting.author["@id"]).to.eq(PERSON_ID)
    })
  })

  it("does not add JSON-LD to pages that have no profile or article to describe", () => {
    for (const path of ["/posts/", "/connect/", "/connect-with-me/"]) {
      withJsonLd(path, (blocks) => expect(blocks, path).to.have.length(0))
    }
  })
})
