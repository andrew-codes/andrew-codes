// Controlled topic vocabulary for posts. Post front matter `tags` are
// free-form (`ai` vs `agents`, `node.js`, `home assistant`), so anything that
// groups or filters posts for machine consumers resolves tags through this
// list instead. Each topic has a stable kebab-case slug, a display label, and
// the legacy tag spellings (aliases) that map onto it.
//
// `featured` is not a topic: it is a behaviour flag that happens to live in
// `tags` today, so it is handled separately (see FEATURED_TAG).

type Topic = {
  slug: string
  label: string
  aliases: readonly string[]
}

const FEATURED_TAG = "featured"

const topics = [
  { slug: "agile-estimation", label: "Estimation", aliases: ["estimation"] },
  { slug: "ai", label: "AI", aliases: ["ai", "agents"] },
  { slug: "ansible", label: "Ansible", aliases: ["ansible"] },
  { slug: "automation", label: "Automation", aliases: ["automation"] },
  { slug: "bucketing", label: "Bucketing", aliases: ["bucketing"] },
  { slug: "craftsmanship", label: "Software craftsmanship", aliases: ["craftsmanship"] },
  { slug: "devtools", label: "Developer tools", aliases: ["devtools"] },
  { slug: "forecasting", label: "Forecasting", aliases: ["forecasting"] },
  { slug: "graphql", label: "GraphQL", aliases: ["graphql"] },
  { slug: "guests", label: "Guests", aliases: ["guests"] },
  { slug: "home-assistant", label: "Home Assistant", aliases: ["home assistant"] },
  { slug: "javascript", label: "JavaScript", aliases: ["javascript"] },
  { slug: "jest", label: "Jest", aliases: ["jest"] },
  { slug: "kubernetes", label: "Kubernetes", aliases: ["kubernetes"] },
  { slug: "mocha", label: "Mocha", aliases: ["mocha"] },
  { slug: "nix", label: "Nix", aliases: ["nix"] },
  { slug: "nodejs", label: "Node.js", aliases: ["node.js"] },
  { slug: "presence-detection", label: "Presence detection", aliases: ["presence detection"] },
  { slug: "python", label: "Python", aliases: ["python"] },
  { slug: "react", label: "React", aliases: ["react"] },
  { slug: "relay", label: "Relay", aliases: ["relay"] },
  { slug: "story-points", label: "Story points", aliases: ["story points"] },
  { slug: "tdd", label: "Test-driven development", aliases: ["tdd"] },
  { slug: "voice-assistant", label: "Voice assistants", aliases: ["voice assistant"] },
  { slug: "workflow", label: "Workflow", aliases: ["workflow"] },
  { slug: "zsh", label: "Zsh", aliases: ["zsh"] },
] as const satisfies readonly Topic[]

type TopicSlug = (typeof topics)[number]["slug"]

const normalize = (tag: string) => tag.trim().toLowerCase()

const topicsByKey = new Map<string, Topic>(topics.flatMap((topic) => [topic.slug, ...topic.aliases].map((key) => [normalize(key), topic] as const)))

// A tag may be a topic's slug or any of its aliases, case-insensitively.
const resolveTopic = (tag: string): Topic | undefined => topicsByKey.get(normalize(tag))

type ResolvedTopics = {
  // Distinct topics, in the order the tags first mention them.
  topics: Topic[]
  // Tags that are neither the featured flag nor a known topic.
  unknown: string[]
}

const resolveTopics = (tags: readonly string[] = []): ResolvedTopics => {
  const resolved = new Map<string, Topic>()
  const unknown: string[] = []

  for (const tag of tags) {
    if (normalize(tag) === FEATURED_TAG) continue
    const topic = resolveTopic(tag)
    if (!topic) {
      unknown.push(tag)
    } else if (!resolved.has(topic.slug)) {
      resolved.set(topic.slug, topic)
    }
  }

  return { topics: [...resolved.values()], unknown }
}

export { FEATURED_TAG, resolveTopic, resolveTopics, topics }
export type { ResolvedTopics, Topic, TopicSlug }
