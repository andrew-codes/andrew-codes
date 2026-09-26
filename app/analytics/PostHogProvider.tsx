import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { FC, PropsWithChildren, useEffect, useState } from "react"

const PHProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    posthog.init("phc_7RJ0FZOHZHy4iaMte1XwyX7RqqqMudOq4Sv9g5fUvLC", {
      api_host: "/afph",
      defaults: "2026-01-30",
      person_profiles: "always",
    })

    // Intentional: this flips the hydration-guard flag after mount so the
    // PostHog SDK never initializes during SSR, deliberately triggering the
    // one extra client-only render this rule normally warns against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true)
  }, [])

  if (!hydrated) return <>{children}</>
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export { PHProvider }
