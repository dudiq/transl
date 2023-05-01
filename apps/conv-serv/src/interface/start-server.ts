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
      // {
      //   status: 'processing',
      //   fullPath: 'path',
      //   text: 'partial',
      //   size: 123,
      //   lifeTime: 122,
      //   fileName: 'filename',
      //   id: '2323'
      // }
    ],
  }

  converter.subscribeOnText((params) => {
    const { id } = params
    const index = store.processingFiles.findIndex((file) => file.id === id)
    if (index < 0) return
    const node = store.processingFiles[index]
    node.text = params.text
    node.status = params.status
    node.lifeTime = params.lifeTime

    store.onChange.forEach((handler) => handler())
  })
  converter.run()

  await routerAsyncStorage.run(store, async () => {
    server.listen(port, host, () => {
      console.log(`Server is running on http://${serverPath}`)
    })
  })
}
