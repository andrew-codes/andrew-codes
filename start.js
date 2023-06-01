const { exec } = require("./runtime-utils/process")

async function run() {
  try {
    const prId = process.env.PR_NUMBER
    const deploymentEnv = process.env.DEPLOYMENT_ENV
    const stagedAppsDir = process.env.APP_STAGING_DIR

    if (deploymentEnv === "staging" && prId && stagedAppsDir) {
      require("esbuild-register")
      const { stagePr, start } = require("./staging-server/apps.ts")
      await stagePr(prId, stagedAppsDir)
      const processes = await start(stagedAppsDir)
      await Promise.all(processes)
    } else {
      console.log("Starting production app...")
      await exec("yarn node index.js")
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
run()
