import type { FileTextEntity } from '../../../core/file-text.entity'
import { incomingAudioPath } from '../../../constants'
import { extractAudio } from './extract-audio'
import { whisperConverter } from './whisper-converter'

export type HandleText = (
  id: string,
  text: string,
  status: 'processing' | 'done'
) => void

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

    this.onText(file.id, '', 'processing')

    const text = await whisperConverter(outputAudioPath, (portion) => {
      this.onText(file.id, portion, 'processing')
    })

    this.onText(file.id, text, 'done')

    this.isProcessing = false

    this.run()
  }
}
