// Single source of truth for Andrew's public profile and social accounts.
// Read by the /connect-with-me page and MainNav, and by the site graph
// (app/libs/agent/site-graph.server.ts) that feeds the machine-readable
// endpoints. Public fields only - never add email, phone, or address, and
// keep `location` to the city.

import type { TopicSlug } from "./topics"

type SocialLink = {
  id: string
  label: string
  handle: string
  url: string
  description: string
  action: string
}

const profile = {
  name: "James Andrew Smith",
  displayName: "Andrew Smith",
  headline: "Staff Software Engineer",
  bio: "I create robust, scalable applications and drive engineering teams.",
  url: "https://andrew.codes",
  image: "/images/andrew-smith.webp",
  location: "Atlanta, GA",
  resumeUrl: "/James Andrew Smith - Resume.pdf",
  // Topic slugs (see ./topics) the site's own posts back up.
  expertise: ["react", "graphql", "javascript", "tdd", "craftsmanship", "agile-estimation", "forecasting", "devtools", "automation", "home-assistant", "ai"] satisfies TopicSlug[],
}

const socialLinks: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "JamesAndrewSmith",
    url: "https://linkedin.com/in/JamesAndrewSmith",
    description: "Send me a connection request and tell me what you are working on.",
    action: "Connect on LinkedIn",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "andrew-codes",
    url: "https://github.com/andrew-codes",
    description: "See what I am building and follow along with my open source work.",
    action: "Follow on GitHub",
  },
]

const getSocialLink = (id: string) => {
  const link = socialLinks.find((l) => l.id === id)
  if (!link) throw new Error(`Unknown social link: ${id}`)
  return link
}

export { getSocialLink, profile, socialLinks }
export type { SocialLink }
