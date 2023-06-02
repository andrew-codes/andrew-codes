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
  stagedAppProcesses: Record<string, { prId: string; process: ChildProcess }>,
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

  app.use("/app/:prId", (req, res) => {
    if (
      !authToken ||
      req.headers.authorization !==
        `Bearer ${Buffer.from(authToken).toString("base64")}`
    ) {
      return res.status(401).send("Unauthorized")
    }
    if (!req.params.prId) {
      return res.status(400).send("Bad Request")
    }
    if (req.method !== "DELETE") {
      return res.status(405).send("Method Not Allowed")
    }

    const { process } = stagedAppProcesses[req.params.prId]
    process.on("exit", (code) => {
      console.log(`Child process exited with code ${code}`)
      try {
        fsExtra.removeSync(`${stagedAppsDir}/pr-${req.params.prId}`)
        console.log(`Deleted app for PR ${req.params.prId}`)
        res.status(200).send("OK")
      } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting app")
      }
    })
    console.log(`Killing process for ${req.params.prId}`)
    process.kill("SIGINT")
    fsExtra.removeSync(`${stagedAppsDir}/pr-${req.params.prId}`)
    console.log(`Deleted app for PR ${req.params.prId}`)
    res.status(200).send("OK")
  })

  app.use("/", async (req, res) => {
    const apps = await getApps(stagedAppsDir)
    const html = renderToString(<LandingPage apps={apps} />)

    res.status(200).send(html)
  })

  app.use(catchAllErrors)

  const port = process.env.PORT ?? 3001
  app.listen(port, () => {
    console.log(`Staging express server listening on port ${port}`)
  })
}

export default run
