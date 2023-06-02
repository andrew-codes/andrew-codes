const { spawn } = require("child_process")

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

module.exports = { exec }
