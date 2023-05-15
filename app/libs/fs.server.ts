import fs from "fs/promises"
import path from "path"
const readDir = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir)
  if (!files) {
    return []
  }

  let results: string[] = []

  for (let file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)
    if (stat?.isDirectory()) {
      const subDirResults = await readDir(filePath)
      results = results.concat(subDirResults)
    } else {
      results.push(filePath)
    }
  }

  return results
}

const readDirFiles = async (dir: string): Promise<[string, string][]> => {
  const files = await readDir(dir)

  if (files.length === 0) {
    return []
  }

  const results: [string, string][] = []
  for (let file of files) {
    const contents = await fs.readFile(file, "utf8")
    results.push([file, contents])
  }

  return results
}

const fileName = (filePath: string): string => path.basename(filePath)
const directoryPath = (filePath: string): string => path.dirname(filePath)

export { directoryPath, fileName, readDir, readDirFiles }
