const { spawn } = require("child_process")

async function run() {
  try {
    const prNumber = process.env.PR_NUMBER
    const deploymentEnv = process.env.DEPLOYMENT_ENV

    if (deploymentEnv === "staging" && prNumber) {
      const stageApps = require("./scripts/stage-app")
      await stageApps()
    }

    console.log("Starting app...")
    await exec("yarn run start")
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
run()

async function exec(command, options) {
  const child = spawn(command, { shell: true, stdio: "inherit", ...options })
  await new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
