const { spawn } = require("child_process")
const fs = require("fs/promises")

async function run() {
  try {
    const prNumber = process.env.PR_NUMBER
    const deploymentEnv = process.env.DEPLOYMENT_ENV
    const stagedAppsDir = process.env.APP_STAGING_DIR

    const processes = []
    if (deploymentEnv === "staging" && prNumber && stagedAppsDir) {
      const stageApps = require("./scripts/stage-app")
      await stageApps()

      console.log("Starting staging server...")
      processes.push(
        exec(`yarn node staging-server/index.js`, {
          env: process.env,
          PORT: "3001",
        }),
      )

      console.log("Starting staged apps...")
      let port = 3002
      const ports = {}
      const fsPaths = await fs.readdir(stagedAppsDir)
      for (const fsPath of fsPaths) {
        const fsEntryPath = `${stagedAppsDir}/${fsPath}`
        const fsEntryStat = await fs.stat(fsEntryPath)
        if (!fsEntryStat.isDirectory() && !fsPath.startsWith("pr-")) {
          continue
        }
        const otherPrNumber = fsPath.replace("pr-", "")
        ports[otherPrNumber] = port
        console.log(
          `Starting staged app for PR ${prNumber}, located at ${fsEntryPath}, on port ${port}...`,
        )
        processes.push(
          exec(`yarn node ${fsEntryPath}/server/index.js`, {
            env: { ...process.env, PORT: port.toString() },
          }),
        )
        port += 1
      }

      console.log("Configuring nginx...")
      const nginxConfig = `
      server {
        server_name staging.andrew.codes;
        listen 8080;
       
        location /healthcheck {
          proxy_pass http://localhost:3001/healthcheck;
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
        }

        ${Object.entries(ports)
          .map(
            ([prNumber, port]) => `
location /${prNumber} {
          proxy_pass http://localhost:${port};
          proxy_redirect / /${prNumber}/;
          proxy_pass_header Authorization;
          proxy_set_header Host $host;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-Proto https;
          proxy_set_header Accept-Encoding "";
          add_header Front-End-Https on;
          add_header Strict-Transport-Security "max-age=15552000";
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_http_version 1.1;
          proxy_set_header Connection "upgrade";
          client_max_body_size 0;
          rewrite ^/${prNumber}(.*)$ $1 break;
          sub_filter_types text/html text/css application/javascript;
          sub_filter '"/' '"/${prNumber}/';
          sub_filter "'/" "'/${prNumber}/";
          sub_filter_once off;
        }`,
          )
          .join("\n")}
      }
      `
      console.log(nginxConfig)
      await fs.writeFile(
        "/etc/nginx/sites-enabled/default",
        nginxConfig,
        "utf8",
      )

      processes.push(exec("nginx -V"))
      processes.push(exec('nginx -g "daemon off;"'))

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
