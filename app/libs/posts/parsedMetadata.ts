import type { ParsedPostMetadata } from "./types.d"

const parsedMetadata = (metadata: Record<string, any>): ParsedPostMetadata => ({
  ...metadata,
  date: metadata?.date ? new Date(metadata?.date) : undefined,
})

export default parsedMetadata
