require("@remix-run/node/dist/globals").installGlobals()

require("dotenv/config")

if (
  process.env.NODE_ENV === "production" ||
  process.env.DEPLOYMENT_ENV === "staging"
) {
  require("./dist/server")
} else {
  require("./server")
}
