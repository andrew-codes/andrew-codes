import { redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"

const loader = async (args: LoaderArgs) => {
  return redirect("/posts/react-with-relay-graphql-talk")
}

export { loader }