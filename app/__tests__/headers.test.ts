import fs from "fs"
import { describe, expect, it } from "vitest"

// Cloudflare reads app/public/_headers from the build output. The static
// server used for e2e ignores it, so the rules are checked here.

const headers = fs.readFileSync("app/public/_headers", "utf8")

const rulesFor = (pattern: string): string[] => {
  const lines = headers.split("\n")
  const start = lines.findIndex((line) => line === pattern)
  if (start === -1) return []
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((line) => line !== "" && !line.startsWith(" "))
  return (end === -1 ? rest : rest.slice(0, end)).map((line) => line.trim()).filter(Boolean)
}

describe("_headers", () => {
  it("serves every markdown twin as text/markdown", () => {
    expect(rulesFor("/*.md")).toContain("Content-Type: text/markdown; charset=utf-8")
  })

  it.each(["/llms.txt", "/llms-full.txt"])("serves %s as text/plain so browsers display it", (path) => {
    expect(rulesFor(path)).toContain("Content-Type: text/plain; charset=utf-8")
  })
})
