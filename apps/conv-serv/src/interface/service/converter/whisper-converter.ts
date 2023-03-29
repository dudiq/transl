import { spawn } from 'child_process'
import fs from 'fs'
import which from 'which'
import ms from 'ms'

const whisperMain = which.sync('whisper')

type ModelType = 'tiny' | 'small' | 'medium' | 'large'

type Args = {
  model: ModelType
  onAppend: (text: string) => void
  lang: string
  audioFilePath: string
}

function runWhisper(params: Args): Promise<string> {
  return new Promise((resolve, reject) => {
    const args =
      `${params.audioFilePath} --device cuda --language ${params.lang} --output_format txt --model ${params.model} --verbose True -o ../../data/incoming/text/`.split(
        ' '
      )

    console.log('args', args.join(' '))
    const whisperProc = spawn(whisperMain, args)

    const fullPath = `${params.audioFilePath}.txt`
    fs.writeFileSync(fullPath, '')

    let textChunk = ''

    whisperProc.stdout.on('data', (data: any) => {
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
      textChunk = textChunk + res
      params.onAppend(textChunk)
      console.log(`STDOUT: ${data}`)
    })

    whisperProc.stderr.on('data', (data: any) => {
      console.log(`STDERR: ${data}`)
    })

    whisperProc.on('close', (code: number) => {
      console.log(`child process exited with code ${code}`)
      const content = fs.readFileSync(fullPath, {
        encoding: 'utf-8',
      })
      code === 0 ? resolve(content) : reject()
    })
  })
}

function printFileSize(prefix: string, filePath: string): void {
  const stats = fs.statSync(filePath)
  const fileSizeInBytes = stats.size

  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
  console.log(
    `--- [${prefix}] ${filePath}, size: ${Math.floor(fileSizeInMegabytes)} Mb`
  )
}

const timeLogs: any[] = []

export async function whisperConverter(
  audioFilePath: string,
  onAppend: (portion: string) => void
): Promise<string> {
  timeLogs.push({
    time: new Date(),
    msg: 'start',
  })

  printFileSize('audio file', audioFilePath)

  timeLogs.push({
    time: new Date(),
    msg: 'audio extracted',
  })
  const text = await runWhisper({
    audioFilePath,
    lang: 'Russian',
    onAppend,
    model: (process.env.TCS_MODEL || 'medium') as ModelType,
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
  return text
}
