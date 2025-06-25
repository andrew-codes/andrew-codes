import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { FC, PropsWithChildren, useEffect, useState } from "react"

const PHProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    posthog.init("phc_7RJ0FZOHZHy4iaMte1XwyX7RqqqMudOq4Sv9g5fUvLC", {
      api_host: "/afph",
      defaults: "2025-05-24",
      person_profiles: "always",
    })

    setHydrated(true)
  }, [])

  if (!hydrated) return <>{children}</>
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export { PHProvider }
