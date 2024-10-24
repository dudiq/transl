import { RunWhisperArgs } from '../../../core/run-whisper-args'

export function getFastWispCpu(params: RunWhisperArgs) {
  //const model = 'large-v3' // 'distil-large-v2'

  const argsCPU =
    `../cli-convert/cmd/py-faster-wisp/fast-wisp.py --model large-v3 --audio ${params.audioFilePath}`.split(
      ' '
    )

  return {
    whisperPath: 'python',
    args: argsCPU,
  }
}
