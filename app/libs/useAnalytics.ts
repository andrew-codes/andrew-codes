import { merge } from "lodash-es"
import { useEffect, useRef } from "react"

const useAnalytics = () => {
  const mouseCoordinates = useRef({
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    screenX: 0,
    screenY: 0,
  })
  const handleMouseMove = (evt: MouseEvent) => {
    if (!mouseCoordinates.current) {
      return
    }

    mouseCoordinates.current.x = evt.clientX
    mouseCoordinates.current.y = evt.clientY
    mouseCoordinates.current.pageX = evt.pageX
    mouseCoordinates.current.pageY = evt.pageY
    mouseCoordinates.current.screenX = evt.screenX
    mouseCoordinates.current.screenY = evt.screenY
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const track = (event: string, data?: Record<string, any>) => {
    if (typeof window === "undefined") {
      return
    }

    fetch("/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        properties: merge({}, data ?? {}, {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          referrer: document.referrer,
          ...(mouseCoordinates.current ?? {}),
        }),
      }),
    })
  }

  const timeEvent = (event: string) => {
    fetch("/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timedEvent: true,
        event,
      }),
    })
  }

  return {
    track,
    timeEvent,
  }
}

export default useAnalytics
