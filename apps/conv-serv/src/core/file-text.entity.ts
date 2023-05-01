import { FileStatusValueObject } from './file-status.value-object'
import { ModelValueObject } from './model.value-object'
import { RunnerValueObject } from './runner.value-object'

export type FileTextEntity = {
  id: string
  fileName: string
  fullPath: string
  size: number
  text: string
  lifeTime: number
  model: ModelValueObject
  runner: RunnerValueObject
  status: FileStatusValueObject
}
