import which from 'which'
import { RunWhisperArgs } from '../../../core/run-whisper-args'

export function getWhisperFasterCpu(params: RunWhisperArgs) {
  const whisperPath = which.sync(
    '../cli-convert/cmd/whisper-faster/whisper-faster.exe'
  )

  const args =
    `${params.audioFilePath} --model_dir=../../apps/cli-convert/models --output_format=json --language=ru --model=medium`.split(
      ' '
    )

  return {
    whisperPath,
    args,
  }
}
