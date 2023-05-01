import type { FileTextEntity } from '../../../core/file-text.entity'
import { incomingAudioPath } from '../../../constants'
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

    const outputAudioPath = `${incomingAudioPath}${file.fileName}.wav`

    await extractAudio({
      inputVideoPath: file.fullPath,
      fileName: file.fileName,
      outputAudioPath,
    })

    this.onText({
      id: file.id,
      text: '',
      status: 'processing',
      lifeTime: 0,
    })

    const startDate = new Date()

    const text = await whisperConverter({
      audioFilePath: outputAudioPath,
      model: file.model,
      runner: file.runner,
      onAppend: (portion) => {
        const nextDate = new Date()
        this.onText({
          id: file.id,
          text: portion,
          status: 'processing',
          lifeTime: nextDate.getTime() - startDate.getTime(),
        })
      },
    })

    const endDate = new Date()

    this.onText({
      id: file.id,
      text,
      status: 'done',
      lifeTime: endDate.getTime() - startDate.getTime(),
    })

    this.isProcessing = false

    this.run()
  }
}
