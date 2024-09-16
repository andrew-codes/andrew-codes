import createCache, { EmotionCache } from "@emotion/cache"

function createEmotionCache(): EmotionCache {
  return createCache({ key: "css" })
}

export default createEmotionCache
