import { ProcessingFileEntity } from '~/modules/convert/core/processing-file.entity'
import React from 'react'
import { formatBytes } from '~/modules/convert/interface/format-bytes'
import { Badge, BadgeType } from '~/modules/ui-kit/badge'
import { CopyButton } from './copy-button'
import { FileStatusValueObject } from '~/modules/convert/core/file-status.value-object'

type Props = {
  files: ProcessingFileEntity[]
}

const statusToType: Record<FileStatusValueObject, BadgeType> = {
  wait: 'blue',
  done: 'green',
  processing: 'yellow',
}

export function ProcessingFiles({ files }: Props) {
  return (
    <>
      <div className="flex max-w-3xl flex-col gap-2">
        {files.map((file) => {
          return (
            <div key={file.id} className="my-1 flex flex-col gap-2">
              <div className="flex gap-1">
                <Badge status={statusToType[file.status]}>{file.status}</Badge>
                <div className="ml-2 text-sm font-bold">
                  {formatBytes(file.size)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="whitespace-pre">{file.fileName}</div>
              </div>

              <div className="flex gap-2">
                <CopyButton text={file.text} />
                <textarea
                  rows={2}
                  readOnly
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Wait while file processing"
                  value={file.text}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
