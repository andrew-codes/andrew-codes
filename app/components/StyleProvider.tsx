import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { CssVarsProvider } from "@mui/joy/styles"
import { FC, PropsWithChildren, useMemo, useState } from "react"
import theme from "../theme"
import ClientStyleContext from "./ClientStylesContext"

function createEmotionCache() {
  return createCache({ key: "css" })
}

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
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>
        <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
      </CacheProvider>
    </ClientStyleContext.Provider>
  )
}

export { StyleProvider }
