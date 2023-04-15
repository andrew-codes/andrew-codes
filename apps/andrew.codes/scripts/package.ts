import Docker from "dockerode"
import path from "path"
import sh from "shelljs"

const run = async () => {
  sh.exec(`yarn pack`)
  const docker = new Docker()

  await docker.buildImage(
    {
      context: path.join(__dirname, ".."),
      src: ["Dockerfile", "package.tzg", "dist"],
    },
    { t: imageName },
  )
}

if (require.main === module) {
  run()
}

export default run
