import type { Router } from "express"
import express from "express"
import "express-async-errors"

const run = async () => {
  const mode = process.env.DEPLOY_MODE ?? "production"
  const app = express()

  let routers: Record<string, Router> = {}
  if (mode === "development") {
    routers["/"] = require("../app.router").default
  } else if (mode === "staging") {
  } else {
    routers["/"] = require("../app.router")
  }
  Object.entries(routers).forEach(([path, router]) => {
    app.use(path, router)
  })

  const port = process.env.PORT ?? 3000
  app.listen(port, () => {
    if (mode === "development") {
      require("../build")
    } else if (mode === "staging") {
    } else {
      require("../build")
    }
    console.log(`Express server listening on port ${port}`)
  })
}

if (require.main !== module) {
  run()
}
export default run
