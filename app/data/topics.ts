// Topic vocabulary for posts. Post front matter `tags` are free-form (`ai` vs
// `agents`, `node.js`, `home assistant`), and every tag becomes a topic:
// the URL slug of its /tags/:slug page and the key that machine consumers
// group and filter posts by.
//
// The `topics` list below is curated and only needed for special cases:
// merging spellings onto one topic (`ai` and `agents`), or a nicer display
// label than the one derived from the tag text (`GraphQL`, not `Graphql`).
// A tag that is not listed still works: it gets its own topic, with slug and
// label derived from the tag text (see `topicForTag`), so adding a tag to a
// post never needs a change here and can never fail the build.

type Topic = {
  slug: string
  label: string
  aliases: readonly string[]
}

const topics = [
  { slug: "agile-estimation", label: "Estimation", aliases: ["estimation"] },
  { slug: "ai", label: "AI", aliases: ["ai", "agents"] },
  { slug: "automation", label: "Automation", aliases: ["automation"] },
  { slug: "craftsmanship", label: "Software craftsmanship", aliases: ["craftsmanship"] },
  { slug: "devtools", label: "Developer tools", aliases: ["devtools"] },
  { slug: "forecasting", label: "Forecasting", aliases: ["forecasting"] },
  { slug: "graphql", label: "GraphQL", aliases: ["graphql"] },
  { slug: "home-assistant", label: "Home Assistant", aliases: ["home assistant"] },
  { slug: "javascript", label: "JavaScript", aliases: ["javascript"] },
  { slug: "jest", label: "Jest", aliases: ["jest"] },
  { slug: "kubernetes", label: "Kubernetes", aliases: ["kubernetes"] },
  { slug: "mocha", label: "Mocha", aliases: ["mocha"] },
  { slug: "nodejs", label: "Node.js", aliases: ["node.js"] },
  { slug: "react", label: "React", aliases: ["react"] },
  { slug: "tdd", label: "Test-driven development", aliases: ["tdd"] },
  { slug: "voice-assistant", label: "Voice assistants", aliases: ["voice assistant"] },
] as const satisfies readonly Topic[]

type TopicSlug = (typeof topics)[number]["slug"]

const normalize = (tag: string) => tag.trim().replace(/\s+/g, " ").toLowerCase()

// Lower-case ASCII kebab-case: accents are stripped, every other run of
// characters becomes one hyphen. A tag with nothing sluggable in it (`+++`)
// falls back to its code points so it still gets a distinct, valid slug.
const slugify = (tag: string): string => {
  const slug = normalize(tag)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const codePoints = [...normalize(tag)].map((character) => character.codePointAt(0)!.toString(16))
  return slug || (codePoints.length > 0 ? `x-${codePoints.join("-")}` : "untitled")
}

// Words are capitalised unless the author already used capitals in the tag
// (`OpenAI`, `GraphQL`), which is taken as the intended spelling.
const deriveLabel = (tag: string): string => {
  const spaced = tag.trim().replace(/\s+/g, " ")
  if (/[A-Z]/.test(spaced)) return spaced
  return spaced.replace(/(^|[\s-])(\p{L})/gu, (_match, boundary: string, letter: string) => `${boundary}${letter.toUpperCase()}`)
}

const topicsByKey = new Map<string, Topic>(topics.flatMap((topic) => [topic.slug, ...topic.aliases].map((key) => [normalize(key), topic] as const)))

// The curated topic a tag maps onto: by slug or alias, case-insensitively.
const findCuratedTopic = (tag: string): Topic | undefined => topicsByKey.get(normalize(tag))

// Every tag has a topic. A tag that is not curated gets a derived one, unless
// its derived slug is a curated slug (`Home-Assistant`), which folds into that.
const topicForTag = (tag: string): Topic => {
  const curated = findCuratedTopic(tag) ?? topicsByKey.get(slugify(tag))
  return curated ?? { slug: slugify(tag), label: deriveLabel(tag), aliases: [] }
}

type ResolvedTopics = {
  // Distinct topics, in the order the tags first mention them.
  topics: Topic[]
  // Tags that had no curated topic and got a derived one. Informational only.
  derivedFrom: string[]
}

const resolveTopics = (tags: readonly string[] = []): ResolvedTopics => {
  const resolved = new Map<string, Topic>()
  const derivedFrom: string[] = []

  for (const tag of tags) {
    if (!findCuratedTopic(tag) && !topicsByKey.has(slugify(tag))) derivedFrom.push(tag)
    const topic = topicForTag(tag)
    if (!resolved.has(topic.slug)) resolved.set(topic.slug, topic)
  }

  return { topics: [...resolved.values()], derivedFrom }
}

export { findCuratedTopic, resolveTopics, slugify, topicForTag, topics }
export type { ResolvedTopics, Topic, TopicSlug }
