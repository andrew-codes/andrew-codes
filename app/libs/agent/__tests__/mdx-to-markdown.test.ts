import { describe, expect, it } from "vitest"
import { transformMdxToMarkdown, type MdxToMarkdownOptions } from "../mdx-to-markdown"

const options: MdxToMarkdownOptions = {
  siteUrl: "https://andrew.codes",
  resolveAsset: (assetPath) => {
    const file = assetPath.split("/").at(-1)
    return file === "missing.png" ? undefined : `/files/${file?.replace(/\.(\w+)$/, "-HASH.$1")}`
  },
  codeAssets: { "list.code.sh": { raw: "code --list-extensions\n" } },
}

const transform = (source: string, overrides: Partial<MdxToMarkdownOptions> = {}) => transformMdxToMarkdown(source, { ...options, ...overrides })

describe("transformMdxToMarkdown", () => {
  it("passes plain markdown through", () => {
    const source = "## Heading\n\nA paragraph with **bold**, *emphasis* and `code`.\n\n- one\n- two\n\n1. first\n2. second"

    expect(transform(source)).toBe(source)
  })

  it("strips front matter", () => {
    expect(transform("---\ntitle: A post\ntags:\n  - one\n---\n\nBody text.")).toBe("Body text.")
  })

  it("keeps fenced code blocks verbatim, including MDX-looking syntax", () => {
    const source = '```tsx\nimport x from "y"\nconst a = <Thing prop={1} />\n```'

    expect(transform(source)).toBe(source)
  })

  it("keeps GFM tables without padding cells", () => {
    const output = transform("| Name | Notes |\n| :--- | :--- |\n| A | Short |\n| Longer name | Much longer note text here |")

    expect(output).toContain("| Name | Notes |")
    expect(output).toContain("| Longer name | Much longer note text here |")
  })

  describe("imports", () => {
    it("drops import statements", () => {
      const output = transform('import { SiAndroid } from "react-icons/si"\nimport logo from "./logo.png"\n\nBody.')

      expect(output).toBe("Body.")
    })

    it("resolves an image imported and used through JSX to its served URL", () => {
      const output = transform('import logo from "./public/files/logo.png"\n\n<img src={logo} alt="The logo" />')

      expect(output).toBe("![The logo](https://andrew.codes/files/logo-HASH.png)")
    })

    it("drops JSX icons and decorative images from headings and tidies the heading text", () => {
      const output = transform(
        'import { SiAndroid } from "react-icons/si"\nimport logo from "./logo.png"\n\n### <SiAndroid style={{ color: "#3ddc84" }} /> Native app\n\n### <img src={logo} style={{ width: "1em" }} /> Home Assistant',
      )

      expect(output).toBe("### Native app\n\n### Home Assistant")
    })
  })

  describe("asset URLs", () => {
    it("resolves a relative markdown image through resolveAsset and makes it absolute", () => {
      expect(transform("![Diagram](./public/files/architecture.png)")).toBe("![Diagram](https://andrew.codes/files/architecture-HASH.png)")
    })

    it("resolves a linked image (image inside a link) and keeps the link target", () => {
      const output = transform("[![Demo](./public/files/showcase.png)](https://www.loom.com/share/abc)")

      expect(output).toBe("[![Demo](https://andrew.codes/files/showcase-HASH.png)](https://www.loom.com/share/abc)")
    })

    it("makes root-relative images and links absolute", () => {
      const output = transform("![Chart](/images/posts/chart.webp)\n\nSee [the other post](/posts/other).")

      expect(output).toContain("![Chart](https://andrew.codes/images/posts/chart.webp)")
      expect(output).toContain("[the other post](https://andrew.codes/posts/other)")
    })

    it("leaves absolute URLs and in-page anchors alone", () => {
      const output = transform("[out](https://example.com/a) and [in](#section)")

      expect(output).toBe("[out](https://example.com/a) and [in](#section)")
    })

    it("falls back to the alt text when an asset cannot be found", () => {
      expect(transform("![Lost diagram](./missing.png)")).toBe("Lost diagram")
    })
  })

  describe("CollapsibleSection", () => {
    it("becomes a level 2 heading followed by its content", () => {
      const output = transform('Intro.\n\n<CollapsibleSection title="Trade-offs and Alternatives">\n\nInner text.\n\n### Device selection\n\nMore.\n\n</CollapsibleSection>\n\nAfter.')

      expect(output).toBe("Intro.\n\n## Trade-offs and Alternatives\n\nInner text.\n\n### Device selection\n\nMore.\n\nAfter.")
    })
  })

  describe("CodePostAsset", () => {
    it("becomes a fenced code block with the asset's raw contents", () => {
      const output = transform('<CodePostAsset fileName="list.code.sh" language="bash" />')

      expect(output).toBe("```bash\ncode --list-extensions\n```")
    })

    it("fails loudly for an asset that does not exist, as the page render would", () => {
      expect(() => transform('<CodePostAsset fileName="nope.code.sh" language="bash" />')).toThrow(/nope\.code\.sh/)
    })
  })

  describe("other JSX", () => {
    it("converts inline HTML elements to markdown", () => {
      expect(transform('<em>"Ten pounds"</em> and <strong>bold</strong>.')).toBe('*"Ten pounds"* and **bold**.')
    })

    it("unwraps unknown components so their content survives", () => {
      expect(transform("<Callout>\n\nKeep me.\n\n</Callout>")).toBe("Keep me.")
    })

    it("keeps string expressions and drops other expressions", () => {
      expect(transform('a{" "}b {someVariable}c')).toBe("a b c")
    })

    it("drops a paragraph that held only a dropped component", () => {
      expect(transform("Before.\n\n<SiAndroid />\n\nAfter.")).toBe("Before.\n\nAfter.")
    })
  })
})
