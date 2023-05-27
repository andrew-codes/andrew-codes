import type BetterSqlite3 from "better-sqlite3"
import Database from "better-sqlite3"
import * as C from "cachified"
import {
  lruCacheAdapter,
  verboseReporter,
  type CacheEntry,
  type Cache as CachifiedCache,
} from "cachified"
import fs from "fs"
import { getInstanceInfo, getInstanceInfoSync } from "litefs-js"
import { LRUCache } from "lru-cache"
import configuration from "./configuration.server"
import { updatePrimaryCacheValue } from "~/routes/resources/cache.sqlite"
import { time, type Timings } from "./timing.server"
import singleton from "./singleton.server"
import { type } from "os"

type CachifiedOptions = {
  forceFresh?: boolean | string
  request?: Request
  ttl?: number
  timings?: Timings
}

const createDatabase = async (
  tryAgain = true,
): Promise<BetterSqlite3.Database> => {
  const CACHE_DATABASE_PATH = (
    await configuration.getValue("cacheDatabasePath")
  ).value
  const db = new Database(CACHE_DATABASE_PATH)

  const { currentIsPrimary } = getInstanceInfoSync()
  if (!currentIsPrimary) {
    return db
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        metadata TEXT,
        value TEXT
      )
    `)
  } catch (error: unknown) {
    fs.unlinkSync(CACHE_DATABASE_PATH)
    if (tryAgain) {
      console.error(
        `Error creating cache database, deleting the file at "${CACHE_DATABASE_PATH}" and trying again...`,
      )

      return createDatabase(false)
    }

    throw error
  }

  return db
}
const cacheDb = singleton("cacheDb", createDatabase)
const getCache = async (): Promise<CachifiedCache> => {
  const cache = await cacheDb

  return {
    name: "SQLite cache",
    get(key) {
      const result = cache
        .prepare("SELECT value, metadata FROM cache WHERE key = ?")
        .get(key) as any
      if (!result) {
        return null
      }
      return {
        metadata: JSON.parse(result.metadata),
        value: JSON.parse(result.value),
      }
    },
    async set(key, entry) {
      const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
      if (currentIsPrimary) {
        cache
          .prepare(
            "INSERT OR REPLACE INTO cache (key, value, metadata) VALUES (@key, @value, @metadata)",
          )
          .run({
            key,
            value: JSON.stringify(entry.value),
            metadata: JSON.stringify(entry.metadata),
          })
      } else {
        // fire-and-forget cache update
        void updatePrimaryCacheValue({
          key,
          cacheValue: entry,
        }).then((response) => {
          if (!response.ok) {
            console.error(
              `Error updating cache value for key "${key}" on primary instance (${primaryInstance}): ${response.status} ${response.statusText}`,
              { entry },
            )
          }
        })
      }
    },
    async delete(key) {
      const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
      if (currentIsPrimary) {
        cache.prepare("DELETE FROM cache WHERE key = ?").run(key)
      } else {
        // fire-and-forget cache update
        void updatePrimaryCacheValue({
          key,
          cacheValue: undefined,
        }).then((response) => {
          if (!response.ok) {
            console.error(
              `Error deleting cache value for key "${key}" on primary instance (${primaryInstance}): ${response.status} ${response.statusText}`,
            )
          }
        })
      }
    },
  }
}

const lru = singleton(
  "lru-cache",
  () => new LRUCache<string, CacheEntry<unknown>>({ max: 5000 }),
)
const getLruCache = async () => {
  const cache = await lru
  return lruCacheAdapter(cache)
}

const shouldForceFresh = async ({
  forceFresh,
  request,
  key,
}: {
  forceFresh?: boolean | string
  request?: Request
  key: string
}) => {
  if (typeof forceFresh === "boolean") return forceFresh
  if (typeof forceFresh === "string") return forceFresh.split(",").includes(key)

  if (!request) return false
  const fresh = new URL(request.url).searchParams.get("fresh")
  if (typeof fresh !== "string") return false
  if (fresh === "") return true

  return fresh.split(",").includes(key)
}

const cachified = async <Value>({
  request,
  timings,
  ...options
}: Omit<C.CachifiedOptions<Value>, "forceFresh"> & {
  request?: Request
  timings?: Timings
  forceFresh?: boolean | string
}): Promise<Value> => {
  let cachifiedResolved = false
  const cachifiedPromise = C.cachified({
    reporter: verboseReporter(),
    ...options,
    forceFresh: await shouldForceFresh({
      forceFresh: options.forceFresh,
      request,
      key: options.key,
    }),
    getFreshValue: async (context) => {
      // if we've already retrieved the cached value, then this may be called
      // after the response has already been sent so there's no point in timing
      // how long this is going to take
      if (!cachifiedResolved && timings) {
        return time(() => options.getFreshValue(context), {
          timings,
          type: `getFreshValue:${options.key}`,
          desc: `request forced to wait for a fresh ${options.key} value`,
        })
      }

      return options.getFreshValue(context)
    },
  })
  const result = await time(cachifiedPromise, {
    timings,
    type: `cache:${options.key}`,
    desc: `${options.key} cache retrieval`,
  })
  cachifiedResolved = true
  return result
}

const defaultTtl = 1000 * 60 * 60 * 24 * 14
const defaultStaleWhileRevalidate = 1000 * 60 * 60 * 24 * 30

export {
  defaultTtl,
  defaultStaleWhileRevalidate,
  cachified,
  getCache,
  getLruCache,
}
export type { CachifiedOptions }
