import type { MetaDescriptor } from "react-router"
import { describe, expect, it } from "vitest"
import { meta as connectMeta } from "../connect"
import { meta as connectWithMeMeta } from "../connect-with-me"
import { meta as homeMeta } from "../_index"
import { meta as postMeta } from "../posts.$id"
import { meta as postsMeta } from "../posts"
import { meta as recommendationsMeta } from "../recommendations"
import { meta as tagMeta } from "../tags.$id"

const at = (meta: MetaDescriptor[], key: string, value: string) => meta.find((entry) => (entry as Record<string, unknown>)[key] === value) as Record<string, string> | undefined

const canonicalOf = (meta: MetaDescriptor[]) => at(meta, "rel", "canonical")?.href

// The route `meta` signatures only read a few args, so stubs stay minimal.
const run = (fn: unknown, args: Record<string, unknown> = {}) => (fn as (args: unknown) => MetaDescriptor[])({ params: {}, ...args })

describe("route meta", () => {
  it.each([
    ["home", homeMeta, "/"],
    ["posts", postsMeta, "/posts"],
    ["recommendations", recommendationsMeta, "/recommendations"],
    ["connect", connectMeta, "/connect"],
    ["connect-with-me", connectWithMeMeta, "/connect-with-me"],
  ])("%s has a description, canonical, matching og:url and og:type website", (_name, meta, path) => {
    const result = run(meta)
    const canonical = new URL(path, "https://andrew.codes").toString().replace(/\/?$/, "/")

    expect(at(result, "name", "description")?.content).toBeTruthy()
    expect(canonicalOf(result)).toBe(canonical)
    expect(at(result, "property", "og:url")?.content).toBe(canonical)
    expect(at(result, "property", "og:type")?.content).toBe("website")
  })

  it("gives the recommendations page its own title", () => {
    expect(at(run(recommendationsMeta), "title", "Andrew Smith | Recommendations")).toBeDefined()
  })

  it("gives each tag page its own title, description and canonical", () => {
    const result = run(tagMeta, { params: { id: "voice-assistant" }, data: { topic: { slug: "voice-assistant", label: "Voice assistants" }, posts: [] } })

    expect(result).toContainEqual({ title: "Andrew Smith | Posts tagged Voice assistants" })
    expect(at(result, "name", "description")?.content).toContain("Voice assistants")
    expect(canonicalOf(result)).toBe("https://andrew.codes/tags/voice-assistant/")
  })

  it("describes a post as an article with its own url, description and article:* tags", () => {
    const result = run(postMeta, {
      data: {
        slug: "devtools-declared",
        frontmatter: {
          title: "My Developer Workbench, Declared",
          description: "Why I replaced Ansible with Nix.",
          // YAML front matter parses to a Date at build time.
          date: new Date("2026-08-10"),
          category: "engineering",
          tags: ["devtools", "nix"],
        },
      },
    })

    expect(result).toContainEqual({ title: "Andrew Smith | My Developer Workbench, Declared" })
    expect(at(result, "name", "description")?.content).toBe("Why I replaced Ansible with Nix.")
    expect(canonicalOf(result)).toBe("https://andrew.codes/posts/devtools-declared/")
    expect(at(result, "property", "og:url")?.content).toBe("https://andrew.codes/posts/devtools-declared/")
    expect(at(result, "property", "og:type")?.content).toBe("article")
    expect(at(result, "property", "article:published_time")?.content).toBe("2026-08-10")
    expect(at(result, "property", "article:section")?.content).toBe("engineering")
    expect(result.filter((entry) => (entry as Record<string, unknown>).property === "article:tag").map((entry) => (entry as { content: string }).content)).toEqual(["devtools", "nix"])
  })

  it("still describes a post whose loader data is missing", () => {
    const result = run(postMeta, { params: { id: "missing" } })

    expect(at(result, "name", "description")?.content).toBeTruthy()
    expect(canonicalOf(result)).toBe("https://andrew.codes/posts/missing/")
  })
})
