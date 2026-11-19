import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { pageLastmod } from "../page-lastmod"

const root = resolve(__dirname, "../../..")
const hashSources = (sources: readonly string[]) => {
  const hash = createHash("sha256")
  for (const source of sources) hash.update(readFileSync(resolve(root, source)))
  return hash.digest("hex")
}

describe("pageLastmod", () => {
  it.each(Object.entries(pageLastmod))("%s lastmod is current with its source files", (path, { lastmod, sources, hash }) => {
    expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const actual = hashSources(sources)
    expect(
      hash,
      `${path} source files changed. Set its lastmod in app/data/page-lastmod.ts to the change date and hash to "${actual}".`,
    ).toBe(actual)
  })
})
