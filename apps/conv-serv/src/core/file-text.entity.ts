export type FileTextEntity = {
  id: string
  fileName: string
  fullPath: string
  size: number
  text: string
  status: 'wait' | 'processing' | 'done'
}
