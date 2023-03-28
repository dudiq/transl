import '../infra/env'
import './routes-manager'
import './routes-define'

import type { IncomingMessage, ServerResponse } from 'http'
import { createServer } from 'http'
import type { SharedRoutesStorage } from './service/router-async-storage'
import { routerAsyncStorage } from './service/router-async-storage'
import { Converter } from './service/converter/converter'

const host = String(process.env.TCS_HOST)
const port = Number(process.env.TCS_PORT)

export async function startServer(
  handler: (req: IncomingMessage, res: ServerResponse) => void
): Promise<void> {
  const server = createServer(handler)
  const serverPath = `${host}:${port}`
  const converter = new Converter()
  const store: SharedRoutesStorage = {
    converter,
    clients: [],
    onChange: [],
    processingFiles: [
      //   {
      //   status: 'done',
      //   fullPath: 'path',
      //   text: 'partial',
      //   size: 123,
      //   fileName: 'filename',
      //   id: '2323'
      // }
    ],
  }

  converter.subscribeOnText(
    (id: string, text: string, status: 'processing' | 'done') => {
      const index = store.processingFiles.findIndex((file) => file.id === id)
      if (index < 0) return
      store.processingFiles[index].text = text
      store.processingFiles[index].status = status
      store.onChange.forEach((handler) => handler())
    }
  )
  converter.run()

  await routerAsyncStorage.run(store, async () => {
    server.listen(port, host, () => {
      console.log(`Server is running on http://${serverPath}`)
    })
  })
}
