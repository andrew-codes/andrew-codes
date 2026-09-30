import { profile } from "../../data/profile"

// Every /agent/*.json document shares this envelope. `generatedAt` is a
// calendar date, not a timestamp, so rebuilding on the same day produces a
// byte-identical file and diffs stay quiet.

const SCHEMA_URL = `${profile.url}/agent/schema/v1`

type AgentDocument<T> = {
  schema: typeof SCHEMA_URL
  generatedAt: string
  canonical: string
  data: T
}

const absoluteUrl = (path: string) => new URL(path, profile.url).toString()

const buildEnvelope = <T>({ path, data, now = new Date() }: { path: string; data: T; now?: Date }): AgentDocument<T> => ({
  schema: SCHEMA_URL,
  generatedAt: now.toISOString().slice(0, 10),
  canonical: absoluteUrl(path),
  data,
})

export { SCHEMA_URL, absoluteUrl, buildEnvelope }
export type { AgentDocument }
