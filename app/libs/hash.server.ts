import sha1 from "sha1"
import fs from "fs/promises"

const getFilePartsToHash = async (fileName?: string): Promise<string> => {
  if (!fileName) {
    return ""
  }

  const stat = await fs.stat(fileName)

  return stat.mtime.toTimeString()
}

const getHash = (items: string[]): string => {
  return sha1(items.join(""))
}

export { getHash, getFilePartsToHash }
