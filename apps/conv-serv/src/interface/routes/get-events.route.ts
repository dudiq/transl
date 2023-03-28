import type { IncomingMessage, ServerResponse } from 'http'
import { nanoid } from 'nanoid'
import { routerAsyncStorage } from '../service/router-async-storage'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getEventsRoute(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const store = routerAsyncStorage.getStore()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const clientId = nanoid()

  const sendEvent = (data: string): void => {
    res.write(`data: ${data}\n\n`)
  }

  const onChange = (): void => {
    const store = routerAsyncStorage.getStore()
    const struct = {
      files: store?.processingFiles.map((item) => {
        return {
          id: item.id,
          status: item.status,
          size: item.size,
          fileName: item.fileName,
          text: item.text,
        }
      }),
    }
    sendEvent(JSON.stringify(struct))
  }

  if (store) {
    store.clients.push({
      id: clientId,
    })
    store.onChange.push(onChange)
  }

  onChange()

  req.on('close', () => {
    console.log(`${clientId} Connection closed`)
    if (!store) return
    store.clients = store.clients.filter((client) => client.id !== clientId)
    store.onChange = store.onChange.filter((handle) => handle !== onChange)
    res.end('done\n')
  })
}
