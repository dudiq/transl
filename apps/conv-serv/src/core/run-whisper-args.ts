import { ModelValueObject } from './model.value-object'
import { RunnerValueObject } from './runner.value-object'

export type RunWhisperArgs = {
  model: ModelValueObject
  onAppend: (text: string) => void
  audioFilePath: string
  runner: RunnerValueObject
}
