import { Outlet } from "@remix-run/react"
import GlobalStyles from "~/components/GlobalStyles"

const PostRoute = () => {
  return (
    <>
      <GlobalStyles />
      <Outlet />
    </>
  )
}

export default PostRoute
