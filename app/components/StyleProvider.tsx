import { CacheProvider } from "@emotion/react"
import { FC, PropsWithChildren, useMemo } from "react"
import createEmotionCache from "../createEmotionCache"

const StyleProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const cache = useMemo(() => createEmotionCache(), [])

  return <CacheProvider value={cache}>{children}</CacheProvider>
}

export { StyleProvider }
