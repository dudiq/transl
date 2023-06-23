const spawn = require('child_process').spawn
const which = require('which')
const fs = require('fs')

const procPath = which.sync('./cmd/ffmpeg')

function extractAudio(inputVideoPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    if (inputVideoPath.endsWith('wav')) {
      fs.copyFileSync(inputVideoPath, outputAudioPath)
      resolve(undefined)
      return
    }

    const args = [
      '-i',
      inputVideoPath, // input video path
      '-y', // overwrite output file if it exists
      '-vn', // no video
      '-acodec',
      'pcm_s16le',
      '-ar',
      '16000',
      '-ac',
      '2',
      `./${outputAudioPath}`,
    ]

    const procHandle = spawn(procPath, args)

    procHandle.stdout.on('data', (data) => {
      //console.log(`STDOUT: ${data}`)
    })

    procHandle.stderr.on('data', (data) => {
      //console.log(`STDERR: ${data}`)
    })

    procHandle.on('close', (code) => {
      if (code === 0) {
        console.log(`[audio] file finished ${outputAudioPath}`)
        resolve()
        return
      }

      console.log(`[audio] file error appeared ${outputAudioPath}`)
      reject()
    })
  })
}

module.exports = {
  extractAudio,
}
