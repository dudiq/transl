import { FileStatusValueObject } from './file-status.value-object'
import { RunnerValueObject } from './runner.value-object'
import { ModelValueObject } from './model.value-object'

export type ProcessingFileEntity = {
  id: string
  fileName: string
  size: number
  text: string
  lifeTime: number
  model: ModelValueObject
  runner: RunnerValueObject
  status: FileStatusValueObject
}
