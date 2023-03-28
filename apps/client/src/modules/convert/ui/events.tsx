import React, { useEffect, useState } from 'react'
import { SERVER_API } from '~/constants'
import { ProcessingFiles } from './processing-files'
import { ProcessingFileEntity } from '~/modules/convert/core/processing-file.entity'

export function Events() {
  const [files, setFiles] = useState<ProcessingFileEntity[]>([])
  const callback = (arg: any) => {
    console.log('---', arg)
  }
  useEffect(() => {
    const sse = new EventSource(`${SERVER_API}/api/events`)

    sse.addEventListener('message', (e) => {
      console.log('Default message event\n', e)
      const data = JSON.parse(e.data)
      setFiles(data.files)
    })

    sse.addEventListener('received', (e) => {
      const { type: event, data } = e
      callback({ event, data })
      console.log(`${event}: ${data}`)
    })

    sse.addEventListener('error', (e: MessageEvent<any>) => {
      const { type: event, data } = e
      let customData = ''

      // If connection is closed.
      // 0 — connecting, 1 — open, 2 — closed
      if (sse.readyState === 2) {
        console.log('SSE closed', e)
        customData =
          "Connection to server was lost and couldn't be re-established."
      }

      // If still connected & it's an unknown error, attempt reconnection.
      else if (!data) return console.log('Reconnecting SSE...')

      sse.close()
      console.log('Closed SSE...')
      console.log(`${event}: ${customData || data}`)
      callback({ event, data: customData || data })
    })
  }, [])

  return <ProcessingFiles files={files} />
}
