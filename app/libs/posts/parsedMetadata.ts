import type { PostMetadata } from "./posts.server"

const parsedMetadata = (metadata: Record<string, any>): PostMetadata => ({
  ...metadata,
  date: metadata?.date ? new Date(metadata?.date) : undefined,
})

export default parsedMetadata
