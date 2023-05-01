const spawn = require('child_process').spawn
const path = require('path')
const fs = require('fs')
const which = require('which')
const ms = require('ms')
const { extractAudio } = require('./extract-audio')
const whisperMain = which.sync('./cmd/whisper-blas-bin-x64/main.exe')
//const whisperMain = which.sync('whisper')

function runWhisper(params) {
  return new Promise((resolve, reject) => {
    const args =
      `-l ${params.lang} -pp -otxt -m ${params.model} -f ${params.audioFilePath}`.split(
        ' '
      )
    // const args = `${params.audioFilePath} --language ${params.lang} --output_format txt --model ${params.model}`.split(' ')
    console.log('args', args)
    const wisperProcess = spawn(whisperMain, args)

    const dir = path.dirname(__dirname)
    const fullPath = path.join(dir, '../', `${params.audioFilePath}.txt`)
    fs.writeFileSync(fullPath, '')

    wisperProcess.stdout.on('data', (data) => {
      const lines = String(data).split('\n')
      const res = lines
        .map((line) => {
          const secondLine = line.split(']')[1]
          return secondLine ? secondLine.trim() : secondLine
        })
        .join('\n')
      fs.appendFileSync(fullPath, res, {
        encoding: 'utf-8',
      })
      console.log(`STDOUT: ${data}`)
    })

    wisperProcess.stderr.on('data', (data) => {
      console.log(`STDERR: ${data}`)
    })

    wisperProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      code === 0 ? resolve() : reject()
    })
  })
}

function printFileSize(prefix, filePath) {
  const stats = fs.statSync(filePath)
  const fileSizeInBytes = stats.size

  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
  console.log(
    `--- [${prefix}] ${filePath}, size: ${Math.floor(fileSizeInMegabytes)} Mb`
  )
}

const timeLogs = []

async function whisperConverter({ inputVideoPath }) {
  const audioFilePath = `${inputVideoPath.split(' ').join('-')}.wav`
  timeLogs.push({
    time: new Date(),
    msg: 'start',
  })

  await extractAudio(inputVideoPath, audioFilePath)

  printFileSize('video file', inputVideoPath)
  printFileSize('audio file', audioFilePath)

  timeLogs.push({
    time: new Date(),
    msg: 'audio extracted',
  })
  await runWhisper({
    audioFilePath,
    // lang: 'Russian',
    // model: 'large',
    lang: 'ru',
    model: './models/ggml-large.bin',
    //    model: './models/ggml-small.bin'
    //    model: './models/ggml-medium.bin'
  })
  timeLogs.push({
    time: new Date(),
    msg: 'whisper get results',
  })

  timeLogs.reduce((prevItem, item) => {
    const dx = item.time.getTime() - prevItem.time.getTime()
    console.log(`--- ${item.msg} in ${ms(dx, { long: true })} [${dx} ms]`)
    return item
  }, timeLogs[0])
}

module.exports = {
  whisperProcess: whisperConverter,
}
