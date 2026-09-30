import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { discoverArtifacts, formatViolations, scanBuildDir, scanText } from "../privacy-scan"

const dirs: string[] = []
const buildDir = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), "privacy-scan-"))
  dirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true })
    writeFileSync(join(dir, name), content)
  }
  return dir
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe("scanText", () => {
  it.each([
    ["email", "reach me at someone@example.com"],
    ["mailto/tel link", `<a href="mailto:someone@example.com">`],
    ["mailto/tel link", `<a href="tel:+14705359093">`],
    ["phone", "call 470 535 9093"],
    ["phone", "call (470) 535-9093"],
    ["phone", "call +1 470.535.9093"],
    ["phone", "call +44 20 7946 0958"],
    ["street address", "12 Peachtree Street"],
    ["zip code", "Atlanta, GA 30303"],
  ])("catches a planted %s", (kind, text) => {
    expect(scanText("planted.html", text).map((v) => v.kind)).toContain(kind)
  })

  it.each([
    ["social links", `<a href="https://www.linkedin.com/in/andrewcodes">in</a> https://github.com/andrew-codes`],
    ["domain names in text", "Visit andrew.codes or docs.github.com/en"],
    ["version numbers", "react 19.2.0, node v22.11.0, yarn 4.5.1"],
    ["ISO dates and timestamps", "2026-08-12 2026-08-12T10:00:00.000Z"],
    ["epoch millis", "1776816000000"],
    ["svg path data", `<path d="M11 107 203 4.5 3.25"/>`],
    ["city only location", "Atlanta, GA"],
    ["cache-control", "max-age=31536000"],
  ])("does not flag %s", (_, text) => {
    expect(scanText("ok.html", text)).toEqual([])
  })
})

describe("allowlist", () => {
  it("allows the vendored font contact in fonts/OFL.txt", () => {
    expect(scanText("fonts/OFL.txt", "Contact team@latofonts.com")).toEqual([])
  })

  it("still reports a planted email that follows the allowed one in the same file", () => {
    const found = scanText("fonts/OFL.txt", "team@latofonts.com and then owner@example.com")
    expect(found.map((v) => v.match)).toEqual(["owner@example.com"])
  })

  it("does not allow the font contact in other files", () => {
    expect(scanText("index.html", "team@latofonts.com").map((v) => v.kind)).toEqual(["email"])
  })

  it("reports every match of a kind, not just the first", () => {
    expect(scanText("a.txt", "a@example.com b@example.org").map((v) => v.match)).toEqual(["a@example.com", "b@example.org"])
  })
})

describe("scanBuildDir", () => {
  it("discovers text artifacts by extension, including ones added later", () => {
    const dir = buildDir({ "a.html": "", "agent/x.json": "{}", "llms.txt": "", "later/new.md": "", "img.png": "", "app.js": "", "r.pdf": "" })
    expect(discoverArtifacts(dir).map((p) => p.slice(dir.length + 1))).toEqual(["a.html", "agent/x.json", "later/new.md", "llms.txt"])
  })

  it("fails on a planted violation in any discovered artifact", () => {
    const dir = buildDir({ "ok.html": "hello", "agent/planted.json": `{"email":"someone@example.com"}`, "sub/page.md": "call 470 535 9093" })
    expect(formatViolations(scanBuildDir(dir).violations)).toEqual([
      `agent/planted.json: email "someone@example.com"`,
      "sub/page.md: phone \"470 535 9093\"",
    ])
  })

  it("fails when a machine-facing output links the resume PDF", () => {
    const dir = buildDir({ "agent/resume.json": `{"url":"/James%20Andrew%20Smith%20-%20Resume.pdf"}`, "page/index.html": `<a href="/James%20Andrew%20Smith%20-%20Resume.pdf">PDF</a>` })
    expect(scanBuildDir(dir).violations.map((v) => v.file)).toEqual(["agent/resume.json"])
  })

  it("passes a clean build", () => {
    const dir = buildDir({ "index.html": `<a href="https://github.com/andrew-codes">gh</a>`, "sitemap.xml": "<lastmod>2026-08-12</lastmod>" })
    expect(scanBuildDir(dir).violations).toEqual([])
  })
})
