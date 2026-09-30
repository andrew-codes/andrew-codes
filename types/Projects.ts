// `creator`, `maintainer` and `contributor` are things Andrew built or works
// on. `user` is a technology the post is about using (somebody else's tool).
const projectRoles = ["creator", "maintainer", "contributor", "user"] as const
type ProjectRole = (typeof projectRoles)[number]

const projectStatuses = ["active", "archived", "experimental"] as const
type ProjectStatus = (typeof projectStatuses)[number]

// A project definition as authored in post front matter.
type ProjectFrontMatter = {
  slug: string
  name: string
  role: ProjectRole
  url?: string
  repo?: string
  summary?: string
  status?: ProjectStatus
  // Company slug (see app/data/resume.ts), only if built in the course of employment.
  company?: string
}

// A definition, or a bare slug that refers to a definition in another post.
type ProjectReference = ProjectFrontMatter | string

export { projectRoles, projectStatuses }
export type { ProjectFrontMatter, ProjectReference, ProjectRole, ProjectStatus }
