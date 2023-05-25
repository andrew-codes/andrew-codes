const { spawn } = require("child_process")

async function run() {
  console.log("Starting app...")
  await exec("yarn run start")
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
