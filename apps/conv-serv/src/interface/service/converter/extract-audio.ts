import { spawn } from 'child_process'
import which from 'which'

const procPath = which.sync('ffmpeg')

export function extractAudio({
  outputAudioPath,
  inputVideoPath,
}: {
  inputVideoPath: string
  fileName: string
  outputAudioPath: string
}): Promise<void> {
  return new Promise((resolve, reject) => {
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
      `${outputAudioPath}`,
    ]

    const procHandle = spawn(procPath, args)

    procHandle.on('close', (code: number) => {
      if (code === 0) {
        console.log(`[audio] file finished ${outputAudioPath}`)
        resolve(undefined)
        return
      }

      console.log(`[audio] file error appeared ${outputAudioPath}`)
      reject()
    })
  })
}
