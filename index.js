require("@remix-run/node/dist/globals").installGlobals()

require("dotenv/config")

if (process.env.NODE_ENV === "production") {
  require("./dist/app/server")
} else {
  require("./server")
}
