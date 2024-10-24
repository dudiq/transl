import which from 'which'
import { RunWhisperArgs } from '../../../core/run-whisper-args'

const whisperCUDA = which.sync('whisper')

export function getWhisper(params: RunWhisperArgs) {
  const argsCUDA =
    `${params.audioFilePath} --device cuda --language Russian --output_format txt --model turbo --verbose True -o ../../data/incoming/text/`.split(
      ' '
    )

  argsCUDA.push('--initial_prompt', '"Hello, welcome to my lecture."')

  return {
    whisperPath: whisperCUDA,
    args: argsCUDA,
  }
}
