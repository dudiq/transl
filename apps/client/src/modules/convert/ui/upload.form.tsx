import React, { useCallback, useState } from 'react'
import { Button } from '~/modules/ui-kit/button'
import { Loader } from '~/modules/ui-kit/loader'
import { FilesForUpload } from './files-for-upload'
import { SERVER_API } from '~/constants'

export function UploadForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>()

  const handleRemoveFile = useCallback((file: File) => {
    setSelectedFiles((oldFiles) => {
      return oldFiles?.filter((existFile) => file !== existFile)
    })
  }, [])

  const handleChange = useCallback(() => {
    if (!inputFileRef.current) return

    const files = inputFileRef.current?.files
    if (!files) return

    setSelectedFiles([...(selectedFiles || []), ...Array.from(files)])

    inputFileRef.current.value = ''
  }, [selectedFiles])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    /* If file is not selected, then show alert message */
    if (!selectedFiles?.length) {
      alert('Please, select file you want to upload')
      return
    }

    setIsLoading(true)

    /* Add files to FormData */
    const formData = new FormData()
    Object.values(selectedFiles).forEach((file) => {
      formData.append('file', file)
    })

    /* Send request to our api route */
    const response = await fetch(`${SERVER_API}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    const body = (await response.json()) as {
      status: 'ok' | 'fail'
      message: string
    }

    if (body.status === 'fail') {
      alert(body.message)
    } else {
      setSelectedFiles([])
    }

    setIsLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex max-w-3xl flex-col gap-2">
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="h-34 dark:hover:bg-bray-800 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                ref={inputFileRef}
                multiple
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <Button type="submit" disabled={isLoading}>
              Upload and start recognize
            </Button>
            {isLoading && <Loader />}
          </div>
          <FilesForUpload files={selectedFiles} onRemove={handleRemoveFile} />
        </div>
      </form>
    </>
  )
}
