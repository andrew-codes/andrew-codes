import mp from "mixpanel-browser"
import { FC, useEffect } from "react"

const Analytics: FC<{ token?: string }> = ({ token = "" }) => {
  useEffect(() => {
    mp.init(token, {
      autocapture: true,
    })
  }, [])

  return null
}

export default Analytics
