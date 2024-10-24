import { spawn } from 'child_process'
import which from 'which'
import fs from 'fs'
import { incomingAudioPath } from '../../../constants'

const procPath = which.sync('ffmpeg')

function findOutputFiles(dir: string, fileName: string) {
  const dirCont = fs.readdirSync(dir)
  const files = dirCont.filter(
    (elm) => elm.startsWith(fileName) && elm.endsWith('wav')
  )
  return files.map((file) => {
    return `${dir}/${file}`
  })
}

export function extractAudio({
  inputVideoPath,
  fileName,
}: {
  inputVideoPath: string
  fileName: string
}): Promise<string[]> {
  const outputAudioPath = `${incomingAudioPath}${fileName}.wav`

  return new Promise((resolve, reject) => {
    if (inputVideoPath.endsWith('wav')) {
      fs.copyFileSync(inputVideoPath, outputAudioPath)
      resolve([outputAudioPath])
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
      '-map',
      '0',
      '-f',
      'segment',
      '-segment_time',
      '00:20:00',
      '-reset_timestamps',
      '1',
      `${incomingAudioPath}${fileName}_%09d.wav`,
    ]

    console.log('[proc]', `${procPath} ${args.join(' ')}`)

    const procHandle = spawn(procPath, args)

    procHandle.on('close', (code: number) => {
      if (code === 0) {
        console.log(`[audio] file finished ${outputAudioPath}`)
        const files = findOutputFiles(incomingAudioPath, fileName)

        console.log('files', files)
        resolve(files)
        return
      }

      console.log(`[audio] file error appeared ${outputAudioPath}`)
      reject()
    })
  })
}
