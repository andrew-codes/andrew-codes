import { type DataFunctionArgs } from "@remix-run/node"

const loader = async ({ request }: DataFunctionArgs) => {
  try {
    return new Response("OK")
  } catch (error: unknown) {
    console.error(request.url, "healthcheck ❌", { error })
    return new Response("ERROR", { status: 500 })
  }
}

export { loader }
