const fs = require('fs-extra')
const path = require('path')

async function removeFolder(dest) {
  await fs.rmdir(dest, { recursive: true })
}

async function recursiveFolderLookup(lastPath) {
  const listDir = await fs.readdir(lastPath)

  for (let i = 0; i < listDir.length; ++i) {
    const newPath = path.join(lastPath, listDir[i])
    const lstat = await fs.lstat(newPath)

    if (lstat.isDirectory()) {
      if (listDir[i] === 'node_modules') {
        await removeFolder(newPath)
        console.log(`Directory: ${listDir[i]} removed from: ${newPath}`)
      } else {
        await recursiveFolderLookup(newPath)
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const indexOfP = args.indexOf('-p')

  if (indexOfP !== -1 && args[indexOfP + 1]) {
    const initialPath = path.resolve(args[indexOfP + 1])
    console.log(`The initial path is: ${initialPath}`)
    await recursiveFolderLookup(initialPath)
  } else {
    console.log('Argument -p is necessary to indicate the path')
    return
  }
}

main()
