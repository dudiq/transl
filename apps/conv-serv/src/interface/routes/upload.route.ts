import { promises as fs } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import type { File } from 'formidable'
import formidable from 'formidable'
import { nanoid } from 'nanoid'
import { incomingVideoPath, uploadsPath } from '../../constants'
import { routerAsyncStorage } from '../service/router-async-storage'
import type { FileTextEntity } from '../../core/file-text.entity'

/* Don't miss that! */
export const config = {
  api: {
    bodyParser: false,
  },
}

type ProcessedFiles = Array<[string, File]>

export const uploadRoute = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  let status = 200,
    resultBody = { status: 'ok', message: 'Files were uploaded successfully' }

  /* Get files using formidable */
  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024 * 1024 * 1024,
        uploadDir: uploadsPath,
        keepExtensions: true,
        multiples: true,
      })
      const files: ProcessedFiles = []
      form.on('file', function (field, file) {
        files.push([field, file])
      })
      form.on('end', () => resolve(files))
      form.on('error', (err) => reject(err))
      form.parse(req, () => {
        //
      })
    }
  ).catch((e) => {
    console.log(e)
    status = 500
    resultBody = {
      status: 'fail',
      message: 'Upload error',
    }
  })

  if (files?.length) {
    for await (const file of files) {
      const tempPath = file[1].filepath
      const originFileName = (file[1].originalFilename || '')
        .split(' ')
        .join('-')

      const videoFileName = incomingVideoPath + originFileName
      await fs.rename(tempPath, videoFileName)
      const stat = await fs.lstat(videoFileName)
      const store = routerAsyncStorage.getStore()
      if (!store) continue
      const item: FileTextEntity = {
        id: nanoid(),
        status: 'wait',
        fileName: originFileName,
        fullPath: videoFileName,
        text: '',
        size: stat.size,
      }
      store.processingFiles.push(item)
      store.onChange.forEach((handle) => handle())
      store.converter.addFile(item)
    }
  }
  res.writeHead(status)
  res.end(JSON.stringify(resultBody))
}
