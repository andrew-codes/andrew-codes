// import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
// import { Link, useLoaderData } from "@remix-run/react"

const loader = async (args: LoaderArgs) => {
  return null
}

const HomeRoute = () => <h1>Hello</h1>

export default HomeRoute
export { loader }
