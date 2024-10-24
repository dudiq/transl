import { spawn } from 'child_process'
import fs from 'fs'
import ms from 'ms'
import { ModelValueObject } from '../../../core/model.value-object'
import { RunnerValueObject } from '../../../core/runner.value-object'
import { RunWhisperArgs } from '../../../core/run-whisper-args'
import { getWhisperBiasCpu } from './get-whisper-bias-cpu'
import { getWhisperFasterCpu } from './get-whisper-faster-cpu'
import { getFastWispCpu } from './get-fast-wisp-cpu'
import { getWhisper } from './get-whisper'

type TypeCpu = 'bias' | 'faster' | 'py-fast' | 'cuda'

function getArgs(typeCpu: TypeCpu, params: RunWhisperArgs) {
  switch (typeCpu) {
    case 'bias':
      return getWhisperBiasCpu(params)
    case 'faster':
      return getWhisperFasterCpu(params)
    case 'py-fast':
      return getFastWispCpu(params)
    case 'cuda':
      return getWhisper(params)
  }
}

function runWhisper(params: RunWhisperArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    const { whisperPath: whisperCPU, args: argsCPU } = getArgs(
      params.runner === 'cuda' ? 'cuda' : 'py-fast',
      params
    )

    console.log('params', params)
    console.log('args', argsCPU.join(' '))

    const whisperProc = spawn(whisperCPU, argsCPU)

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
      code === 0 ? resolve() : reject()
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

export async function whisperConverter({
  audioFilePath,
  onAppend,
  model,
  runner,
}: {
  audioFilePath: string
  runner: RunnerValueObject
  onAppend: (portion: string) => void
  model: ModelValueObject
}): Promise<string> {
  timeLogs.push({
    time: new Date(),
    msg: 'start',
  })

  printFileSize('audio file', audioFilePath)

  timeLogs.push({
    time: new Date(),
    msg: 'audio extracted',
  })
  try {
    await runWhisper({
      audioFilePath,
      onAppend,
      model,
      runner,
    })
  } catch (e) {
    console.log('---- error', e)
  }

  const text = fs.readFileSync(`${audioFilePath}.txt`, {
    encoding: 'utf-8',
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
