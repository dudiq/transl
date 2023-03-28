import { FileStatusValueObject } from '~/modules/convert/core/file-status.value-object'

export type ProcessingFileEntity = {
  id: string
  fileName: string
  size: number
  text: string
  status: FileStatusValueObject
}
