const path = require('path')
const fs = require('fs')

function getFiles(folderPath) {
  return fs
    .readdirSync(folderPath)
    .filter((file) => fs.lstatSync(path.join(folderPath, file)).isFile())
}

function getFilesForProcess(fileList) {
  const filesMap = {}
  fileList.forEach((fileName) => {
    const key = fileName.split(' ').join('-')
    const isText = fileName.endsWith('.txt') || key.endsWith('.txt')
    const isAudio = fileName.endsWith('.wav') || key.endsWith('.wav')
    const videoKey = isText || isAudio ? fileName.slice(0, -4) : fileName

    const parsedKey = videoKey.split(' ').join('-')
    const secondKey = isText || isAudio ? parsedKey.slice(0, -4) : parsedKey

    filesMap[secondKey] = {
      isText,
      isAudio,
      videoKey,
    }
  })

  return filesMap
}

function getInputFiles() {
  const dir = path.dirname(__dirname)
  const fullPath = path.join(dir, './input')
  const files = getFiles(fullPath)

  return getFilesForProcess(files)
}

module.exports = {
  getInputFiles,
}
