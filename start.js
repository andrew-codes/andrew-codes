const { spawn } = require("child_process")
const fs = require("fs/promises")

async function run() {
  try {
    const prNumber = process.env.PR_NUMBER
    const deploymentEnv = process.env.DEPLOYMENT_ENV
    const stagedAppsDir = process.env.APP_STAGING_DIR

    if (deploymentEnv === "staging" && prNumber && stagedAppsDir) {
      const stageApps = require("./scripts/stage-app")
      await stageApps()

      console.log("Starting staging server...")
      exec(`yarn node staging-server/index.js`)

      console.log("Starting staged apps...")
      let port = 30000
      const ports = {}
      const fsPaths = await fs.readdir(stagedAppsDir)
      for (const fsPath of fsPaths) {
        const fsEntryPath = `${stagedAppsDir}/${fsPath}`
        const fsEntryStat = await fs.stat(fsEntryPath)
        if (!fsEntryStat.isDirectory() && !fsPath.startsWith("pr-")) {
          continue
        }
        ports[prNumber] = port
        console.log(`Starting staged app for PR ${prNumber} on port ${port}...`)
        exec(`yarn node ${fsEntryPath}/server/index.js`, {
          env: { PORT: port },
        })
        port += 1
      }

      console.log("Configuring nginx...")
      const nginxConfig = `
      server {
        server_name staging.smith-simms.family;
        listen 8080;
        if ($scheme != "https") {
          return 301 https://$host$request_uri;
        }

        ${Object.entries(ports)
          .map(
            ([prNumber, port]) => `
location ${prNumber} {
          proxy_pass localhost:${port}/;
          proxy_pass_header Authorization;
          proxy_set_header Host $host;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-Proto $scheme;
          add_header Front-End-Https on;
          add_header Strict-Transport-Security "max-age=15552000";
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_http_version 1.1;
          proxy_set_header Connection "upgrade";
          client_max_body_size 0;
        }`,
          )
          .join("\n")}
      }
      `
      await fs.writeFile("/etc/nginx/sites-available/default", nginxConfig)
      await exec("nginx -g daemon off;")

      return
    }

    console.log("Starting production app...")
    await exec("yarn node index.js")
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
