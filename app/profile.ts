// Single source of truth for Andrew's public profile and social accounts.
// Read by the /connect-with-me page and MainNav; a future machine-readable
// endpoint (HO-256) should read from here too. Public links only - never add
// email, phone, or address.

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
  jobTitle: "Staff Software Engineer",
  resumeUrl: "/James Andrew Smith - Resume.pdf",
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
