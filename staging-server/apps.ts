import fs from "fs/promises"
import fsExtra from "fs-extra"
import path from "path"
import { exec } from "../runtime-utils/process"
import type { StagedApp } from "./types"
import run from "./index"
import { ChildProcess, spawn } from "child_process"
import { keyBy } from "lodash"

const ensureStagedAppDirectory = async (
  prId: string,
  stagingDirectory: string,
): Promise<string> => {
  console.log("Moving app to PR staging directory")
  const appDir = path.join(stagingDirectory, `pr-${prId}`)
  await fsExtra.remove(appDir)
  await fsExtra.ensureDir(appDir)

  return appDir
}

const stagePr = async (
  prId: string,
  stagingDirectory: string,
): Promise<void> => {
  try {
    const stagedAppDirectory = await ensureStagedAppDirectory(
      prId,
      stagingDirectory,
    )
    const distAppDir = path.join(__dirname, "..", "dist")
    await fsExtra.copy(
      path.join(distAppDir, "build"),
      path.join(stagedAppDirectory, "build"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "app"),
      path.join(stagedAppDirectory, "app"),
    )
    await fsExtra.copy(
      path.join(distAppDir, ".babelrc"),
      path.join(stagedAppDirectory, ".babelrc"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "server"),
      path.join(stagedAppDirectory, "server"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "public"),
      path.join(stagedAppDirectory, "public"),
    )
    await fsExtra.copy(
      path.join(distAppDir, "config"),
      path.join(stagedAppDirectory, "config"),
    )
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

interface GetStagedApps {
  (stagingDirectory: string): Promise<StagedApp[]>
}
const getApps: GetStagedApps = async (
  stagingDirectory: string,
): Promise<StagedApp[]> => {
  let port = 3002
  const apps: StagedApp[] = []
  const fsPaths = await fs.readdir(stagingDirectory)
  for (const fsPath of fsPaths) {
    const fsEntryPath = `${stagingDirectory}/${fsPath}`
    const fsEntryStat = await fs.stat(fsEntryPath)
    if (!fsEntryStat.isDirectory() && !fsPath.startsWith("pr-")) {
      continue
    }
    const otherPrNumber = fsPath.replace("pr-", "")
    apps.push({
      prId: otherPrNumber,
      port: port,
      appDirectory: fsEntryPath,
    })
    port += 1
  }

  return apps
}

const startReverseProxy = async (apps: StagedApp[]): Promise<void> => {
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

    
    location / {
      proxy_pass http://localhost:3001;
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

    ${apps
      .map(
        ({ prId, port }) => `
location /${prId} {
      proxy_pass http://localhost:${port};
      proxy_redirect / /${prId}/;
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
      rewrite ^/${prId}(.*)$ $1 break;
      sub_filter_types text/html text/css application/javascript;
      sub_filter '"/' '"/${prId}/';
      sub_filter "'/" "'/${prId}/";
      sub_filter_once off;
    }`,
      )
      .join("\n")}
  }
  `
  await fs.writeFile("/etc/nginx/sites-enabled/default", nginxConfig, "utf8")

  return exec('nginx -g "daemon off;"')
}

const start = async (stagingDirectory: string): Promise<Promise<void>[]> => {
  let processes: Promise<void>[] = []
  console.log("Starting staged apps...")
  const apps = await getApps(stagingDirectory)
  const stagedAppProcesses = apps.map((app) => {
    console.log(
      `Starting staged app for PR ${app.prId}, located at ${app.appDirectory}, on port ${app.port}...`,
    )
    const appProcess = {
      prId: app.prId,
      process: spawn(`yarn node ${app.appDirectory}/server/index.js`, {
        env: { ...process.env, PORT: app.port.toString() },
        shell: true,
        stdio: "inherit",
      }),
    }
    console.log(appProcess.process.pid)
    return appProcess
  })

  processes.push(startReverseProxy(apps))
  require("esbuild-register")
  console.log("Starting staging server...")
  processes.push(
    run(process.env.AUTH_TOKEN ?? null, keyBy(stagedAppProcesses, "prId")),
  )

  return processes
}

export { getApps, stagePr, start }
export type { GetStagedApps }
