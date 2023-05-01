import React from 'react'
import { Button } from '~/modules/ui-kit/button'
import { Loader } from '~/modules/ui-kit/loader'
import { FilesForUpload } from '../files-for-upload'
import { Dropdown } from '~/modules/ui-kit/dropdown'
import { useUploadForm } from './use-upload-form'
import { ModelValueObject } from '~/modules/convert/core/model.value-object'
import { RunnerValueObject } from '~/modules/convert/core/runner.value-object'

export function UploadForm() {
  const {
    handleChangeModel,
    selectedModel,
    handleRemoveFile,
    handleChange,
    inputFileRef,
    isLoading,
    selectedFiles,
    handleSubmit,
    selectedRunner,
    handleChangeRunner,
  } = useUploadForm()

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

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Dropdown<ModelValueObject>
                label="Model"
                onChange={handleChangeModel}
                value={selectedModel}
              >
                <Dropdown.Option value="large" title="Large" />
                <Dropdown.Option value="medium" title="Medium" />
                <Dropdown.Option value="small" title="Small" />
              </Dropdown>
              <Dropdown<RunnerValueObject>
                label="Runner"
                onChange={handleChangeRunner}
                value={selectedRunner}
              >
                <Dropdown.Option value="cpu" title="CPU" />
                <Dropdown.Option value="cuda" title="Graphic card" />
              </Dropdown>
            </div>

            <div>
              <Button type="submit" disabled={isLoading}>
                Upload and start recognize
              </Button>
            </div>

            {isLoading && <Loader />}
          </div>

          <FilesForUpload files={selectedFiles} onRemove={handleRemoveFile} />
        </div>
      </form>
    </>
  )
}
