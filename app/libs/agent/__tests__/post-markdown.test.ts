import { describe, expect, it } from "vitest"
import { createAssetResolver } from "../post-markdown.server"

// What the compiled post looks like: each imported asset is a hashed /files URL.
const code = 'var a="/files/showcase-YPPAN7NR.png";var b="/files/python-logo-KHBPQYBG.svg";var c="/files/showcase-2-AAAAAAAA.png"'

describe("createAssetResolver", () => {
  const resolve = createAssetResolver(code)

  it("finds the hashed URL the page serves an asset from, whatever its relative path", () => {
    expect(resolve("./public/files/showcase.png")).toBe("/files/showcase-YPPAN7NR.png")
    expect(resolve("./public/files/python-logo.svg")).toBe("/files/python-logo-KHBPQYBG.svg")
  })

  it("does not confuse an asset with another whose name starts the same", () => {
    expect(resolve("./showcase-2.png")).toBe("/files/showcase-2-AAAAAAAA.png")
  })

  it("matches the extension too", () => {
    expect(resolve("./public/files/showcase.svg")).toBeUndefined()
  })

  it("returns undefined for an asset the post does not bundle", () => {
    expect(resolve("./missing.png")).toBeUndefined()
  })
})
