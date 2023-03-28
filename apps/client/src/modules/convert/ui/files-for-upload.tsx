import { formatBytes } from '~/modules/convert/interface/format-bytes'
import React from 'react'

type Props = {
  files?: File[]
  onRemove: (file: File) => void
}

export function FilesForUpload({ files, onRemove }: Props) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {files?.map((file) => {
          return (
            <div key={file.name} className="my-1 flex items-center">
              <div className="mr-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() => onRemove(file)}
                  className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  X
                </button>
              </div>
              <div>{file.name}</div>{' '}
              <div className="ml-2 text-sm font-bold">
                {formatBytes(file.size)}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
