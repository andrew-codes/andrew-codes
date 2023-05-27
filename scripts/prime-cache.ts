import { getMdxPages } from "app/libs/mdx.server"

const run = async () => {
  await getMdxPages({ forceFresh: true })
}

if (require.main === module) {
  run()
}

export default run
