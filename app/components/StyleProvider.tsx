import { CacheProvider } from "@emotion/react"
import { FC, PropsWithChildren, useMemo, useState } from "react"
import createEmotionCache from "../createEmotionCache"
import StylesContext from "./StylesContext"

const StyleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [cache, setCache] = useState(createEmotionCache())

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache())
      },
    }),
    [],
  )

  return (
    <StylesContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </StylesContext.Provider>
  )
}

export { StyleProvider }
