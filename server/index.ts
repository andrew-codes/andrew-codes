import type { ErrorRequestHandler, ErrorRequestHandler, Router } from "express"
import fs from "fs/promises"
import express from "express"
import "express-async-errors"

const run = async () => {
  const deploymentEnv = process.env.DEPLOYMENT_ENV ?? "production"
  const stagedAppsDir = process.env.APP_STAGING_DIR
  const app = express()

  let routers: Record<string, Router> = {}
  if (deploymentEnv === "development") {
    routers["/"] = require("../app.router").default
  } else if (deploymentEnv === "staging" && stagedAppsDir) {
    const fsPaths = await fs.readdir(stagedAppsDir)
    for (const fsPath of fsPaths) {
      const fsEntryPath = `${stagedAppsDir}/${fsPath}`
      const fsEntryStat = await fs.stat(fsEntryPath)
      if (!fsEntryStat.isDirectory() && !fsPath.startsWith("pr-")) {
        continue
      }
      routers[`/${fsPath.replace(/^pr-/, "")}`] =
        require(`${fsEntryPath}/app.router`).default
    }
  } else {
    routers["/"] = require("../app.router").default
  }
  console.dir(routers)
  Object.entries(routers).forEach(([path, router]) => {
    app.use(path, router)
  })

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).send("Error")
  })

  const port = process.env.PORT ?? 3000
  app.listen(port, () => {
    if (deploymentEnv === "production") {
      require("../build")
    }

    console.log(`Express server listening on port ${port}`)
  })
}

if (require.main !== module) {
  run()
}
export default run
