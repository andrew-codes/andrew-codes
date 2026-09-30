// Asserts on the prerendered HTML itself (cy.request), not the hydrated DOM:
// crawlers and agents read the static <head> and never run the app.

const ORIGIN = "https://andrew.codes"

const parseHead = (html: string) => new DOMParser().parseFromString(html, "text/html").head

const metaContents = (head: HTMLHeadElement, attr: "name" | "property", value: string) => Array.from(head.querySelectorAll(`meta[${attr}="${value}"]`)).map((el) => el.getAttribute("content"))

// Takes a callback rather than yielding the <head>: Cypress wraps a yielded DOM
// element in jQuery, which would hide the plain DOM API used below.
const withHead = (path: string, assertions: (head: HTMLHeadElement) => void) =>
  cy.request(path).then((response) => {
    expect(response.headers["content-type"]).to.match(/text\/html/)
    assertions(parseHead(response.body as string))
  })

const expectPageMeta = (head: HTMLHeadElement, { url, type, title }: { url: string; type: string; title?: string }) => {
  const canonicals = head.querySelectorAll('link[rel="canonical"]')
  expect(canonicals, "one canonical link").to.have.length(1)
  expect(canonicals[0].getAttribute("href")).to.eq(url)

  expect(metaContents(head, "property", "og:url"), "og:url").to.deep.eq([url])
  expect(metaContents(head, "property", "og:type"), "og:type").to.deep.eq([type])
  expect(metaContents(head, "property", "og:image")[0], "og:image is absolute").to.match(/^https:\/\/andrew\.codes\/images\//)

  const [description] = metaContents(head, "name", "description")
  expect(description, "description").to.be.a("string")
  expect(description!.length, "description is not empty").to.be.greaterThan(0)
  expect(metaContents(head, "name", "description"), "single description").to.have.length(1)
  expect(metaContents(head, "property", "og:description"), "og:description").to.deep.eq([description])

  const [ogTitle] = metaContents(head, "property", "og:title")
  expect(head.querySelectorAll("title"), "single title").to.have.length(1)
  expect(head.querySelector("title")?.textContent).to.eq(ogTitle)
  if (title) expect(ogTitle).to.eq(title)
}

describe("page metadata in the built HTML", () => {
  it("keeps the charset as the first literal tag in <head>", () => {
    withHead("/", (head) => {
      expect(head.firstElementChild?.getAttribute("charset")).to.eq("utf-8")
    })
  })

  it("gives the home page its own canonical and og:url, not a site-wide one", () => {
    withHead("/", (head) => expectPageMeta(head, { url: `${ORIGIN}/`, type: "website" }))
  })

  it("gives every static page a page-specific canonical, og:url and description", () => {
    const pages = [
      ["/posts/", `${ORIGIN}/posts/`, "Andrew Smith | Posts"],
      ["/recommendations/", `${ORIGIN}/recommendations/`, "Andrew Smith | Recommendations"],
      ["/connect/", `${ORIGIN}/connect/`, "Andrew Smith | Connect"],
      ["/connect-with-me/", `${ORIGIN}/connect-with-me/`, "Andrew Smith | Connect with Me"],
    ] as const

    for (const [path, url, title] of pages) {
      withHead(path, (head) => expectPageMeta(head, { url, type: "website", title }))
    }
  })

  it("describes a post as an article with published time, section and one tag entry per tag", () => {
    withHead("/posts/devtools-declared/", (head) => {
      expectPageMeta(head, { url: `${ORIGIN}/posts/devtools-declared/`, type: "article" })

      expect(metaContents(head, "property", "article:published_time")).to.deep.eq(["2026-08-10"])
      expect(metaContents(head, "property", "article:section")).to.deep.eq(["engineering"])
      expect(metaContents(head, "property", "article:tag")).to.deep.eq(["devtools", "automation", "nix", "zsh", "ansible"])
      expect(metaContents(head, "name", "description")[0]).to.contain("Nix")
    })
  })

  it("gives tag pages their own canonical, keyed by topic slug", () => {
    withHead("/tags/voice-assistant/", (head) => {
      expectPageMeta(head, { url: `${ORIGIN}/tags/voice-assistant/`, type: "website", title: "Andrew Smith | Posts tagged Voice assistants" })
    })
  })
})
