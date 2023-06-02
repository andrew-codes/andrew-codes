import type { ErrorRequestHandler } from "express"
import * as React from "react"
import express from "express"
import { renderToString } from "react-dom/server"
import * as appUtils from "./apps"
import LandingPage from "./components/LandingPage"
import { withGitHubInfo } from "./githubInfo"
import type { ChildProcess } from "child_process"
import fsExtra from "fs-extra"

const catchAllErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Error")
}

const run = async (
  authToken: string | null,
  stagedAppProcesses: Record<string, ChildProcess>,
) => {
  const app = express()
  app.use(express.json())

  app.use("/healthcheck", (req, res) => res.status(200).send("OK"))

  const ghToken = process.env.GITHUB_TOKEN
  let getApps = appUtils.getApps
  if (ghToken) {
    getApps = withGitHubInfo(ghToken, getApps)
  }
  const stagedAppsDir = process.env.APP_STAGING_DIR ?? ""
  const apps = await getApps(stagedAppsDir)
  app.use("/", (req, res) => {
    const html = renderToString(<LandingPage apps={apps} />)

    res.status(200).send(html)
  })

  app.use("/app/delete", (req, res) => {
    if (!authToken || req.body.authToken !== authToken) {
      return res.status(401).send("Unauthorized")
    }
    if (!req.body.prId) {
      return res.status(400).send("Bad Request")
    }
    const process = stagedAppProcesses[req.body.prId]
    process.on("close", (code) => {
      if (code !== 200) {
        console.error(`App exited with unexpected code ${code}`)
        res
          .status(500)
          .send(`App exited for unexpected reason. The app was not deleted.`)

        return
      }
      try {
        fsExtra.removeSync(`${stagedAppsDir}/pr-${req.body.prId}`)
        res.status(200).send("OK")
      } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting app")
      }
    })
    process.kill(200)
  })

  app.use(catchAllErrors)

  const port = process.env.PORT ?? 3001
  app.listen(port, () => {
    console.log(`Staging express server listening on port ${port}`)
  })
}

if (require.main === module) {
  run()
}

export default run
