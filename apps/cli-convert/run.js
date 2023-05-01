const { whisperProcess } = require('./src/converter/whisper-converter')
const { getInputFiles } = require('./src/get-input-files')

async function run() {
  const filesMap = getInputFiles()

  for await (const fileKey of Object.keys(filesMap)) {
    const file = filesMap[fileKey]
    if (file.isText || file.isAudio) {
      console.log(`[skipped] ${file.videoKey}`)
      continue
    }

    await whisperProcess({ inputVideoPath: `./input/${file.videoKey}` })
  }
}

run()
