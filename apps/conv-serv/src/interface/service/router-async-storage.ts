import { AsyncLocalStorage } from 'async_hooks'
import type { FileTextEntity } from '../../core/file-text.entity'
import type { Converter } from './converter/converter'

type HandleChange = () => void

export type SharedRoutesStorage = {
  converter: Converter
  onChange: HandleChange[]
  clients: {
    id: string
  }[]
  processingFiles: FileTextEntity[]
}

export const routerAsyncStorage = new AsyncLocalStorage<SharedRoutesStorage>()
