import type { ErrorRequestHandler } from "express"
import * as React from "react"
import express from "express"
import { renderToString } from "react-dom/server"
import * as appUtils from "./apps"
import LandingPage from "./components/LandingPage"
import { withGitHubInfo } from "./githubInfo"

const catchAllErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Error")
}

const run = async () => {
  const app = express()

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
