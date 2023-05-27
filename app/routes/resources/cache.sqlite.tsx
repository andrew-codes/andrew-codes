import { json, redirect, type DataFunctionArgs } from "@remix-run/node"
import { getInstanceInfo, getInternalInstanceDomain } from "litefs-js"
import { getCache } from "~/libs/cache.server"
import configuration from "~/libs/configuration.server"

const action = async ({ request }: DataFunctionArgs) => {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
  if (!currentIsPrimary) {
    throw new Error(
      `${request.url} should only be called on the primary instance (${primaryInstance})}`,
    )
  }
  const token = (await configuration.getValue("internalCommandToken")).value
  const isAuthorized =
    request.headers.get("Authorization") === `Bearer ${token}`
  if (!isAuthorized) {
    console.log(`Unauthorized request to ${request.url}, redirecting...`)

    return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
  }

  const cache = await getCache()
  const { key, cacheValue } = await request.json()
  if (cacheValue === undefined) {
    console.log(`Deleting ${key} from the cache from remote`)
    await cache.delete(key)
  } else {
    console.log(`Setting ${key} in the cache from remote`)
    await cache.set(key, cacheValue)
  }

  return json({ success: true })
}

const updatePrimaryCacheValue = async ({
  key,
  cacheValue,
}: {
  key: string
  cacheValue: any
}) => {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo()
  if (currentIsPrimary) {
    throw new Error(
      `updatePrimaryCacheValue should not be called on the primary instance (${primaryInstance})}`,
    )
  }
  const domain = getInternalInstanceDomain(primaryInstance)
  const token = (await configuration.getValue("internalCommandToken")).value
  return fetch(`${domain}/resources/cache/sqlite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, cacheValue }),
  })
}

export { action, updatePrimaryCacheValue }
