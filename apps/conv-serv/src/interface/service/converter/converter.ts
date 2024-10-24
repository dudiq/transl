import type { FileTextEntity } from '../../../core/file-text.entity'
import { extractAudio } from './extract-audio'
import { whisperConverter } from './whisper-converter'
import { FileStatusValueObject } from '../../../core/file-status.value-object'

export type HandleText = (_: {
  id: string
  text: string
  lifeTime: number
  status: FileStatusValueObject
}) => void

export class Converter {
  private files: FileTextEntity[] = []

  private onText: HandleText = () => {}
  private isProcessing = false

  subscribeOnText(cb: HandleText): void {
    this.onText = cb
  }

  addFile(file: FileTextEntity): void {
    this.files.push(file)
    this.run()
  }

  async run(): Promise<void> {
    if (this.isProcessing) return
    if (this.files.length === 0) return
    const file = this.files.shift()
    if (!file) return
    this.isProcessing = true

    const audioFiles = await extractAudio({
      inputVideoPath: file.fullPath,
      fileName: file.fileName,
    })

    this.onText({
      id: file.id,
      text: '',
      status: 'processing',
      lifeTime: 0,
    })

    const startDate = new Date()
    let fullText = ''

    for await (const audioFilePath of audioFiles) {
      const text = await whisperConverter({
        audioFilePath,
        model: file.model,
        runner: file.runner,
        onAppend: (portion) => {
          const nextDate = new Date()
          this.onText({
            id: file.id,
            text: fullText + portion,
            status: 'processing',
            lifeTime: nextDate.getTime() - startDate.getTime(),
          })
        },
      })
      fullText = fullText + text
    }

    const endDate = new Date()

    this.onText({
      id: file.id,
      text: fullText,
      status: 'done',
      lifeTime: endDate.getTime() - startDate.getTime(),
    })

    this.isProcessing = false

    this.run()
  }
}
