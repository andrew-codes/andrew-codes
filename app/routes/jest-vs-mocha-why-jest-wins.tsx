import { redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"

const loader = async (args: LoaderArgs) => {
  return redirect("/posts/jest-vs-mocha-why-jest-wins")
}

export { loader }