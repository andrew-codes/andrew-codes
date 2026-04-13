import { type LoaderFunctionArgs } from "react-router"

const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    return new Response("OK")
  } catch (error: unknown) {
    console.error(request.url, "healthcheck ❌", { error })
    return new Response("ERROR", { status: 500 })
  }
}

export { loader }
