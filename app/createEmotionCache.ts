import createCache, { EmotionCache } from "@emotion/cache"

function createEmotionCache(): EmotionCache {
  let insertionPoint
  if (typeof document !== "undefined") {
    insertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]',
    ) as HTMLElement | undefined
  }

  return createCache({ key: "css", insertionPoint })
}

export default createEmotionCache
