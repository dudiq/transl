import which from 'which'
import { RunWhisperArgs } from '../../../core/run-whisper-args'

export function getWhisperBiasCpu(params: RunWhisperArgs) {
  const whisperPath = which.sync(
    '../cli-convert/cmd/whisper-blas-bin-x64/main.exe'
  )

  const argsCPU =
    `-l ru -pp -otxt -m ../cli-convert/models/ggml-${params.model}.bin -f ${params.audioFilePath}`.split(
      ' '
    )

  return {
    whisperPath,
    args: argsCPU,
  }
}
