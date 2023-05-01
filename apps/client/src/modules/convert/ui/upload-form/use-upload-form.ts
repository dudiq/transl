import React, { useCallback, useState } from 'react'
import { SERVER_API } from '~/constants'
import { useLocalStorage } from './use-local-storage'
import { ModelValueObject } from '~/modules/convert/core/model.value-object'
import { RunnerValueObject } from '~/modules/convert/core/runner.value-object'

export function useUploadForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const inputFileRef = React.useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>()
  const { storedValue: selectedModel, handleSaveValue: handleChangeModel } =
    useLocalStorage<ModelValueObject>({
      key: '@transl-model',
      defaultValue: 'large',
    })

  const { storedValue: selectedRunner, handleSaveValue: handleChangeRunner } =
    useLocalStorage<RunnerValueObject>({
      key: '@transl-runner',
      defaultValue: 'cuda',
    })

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

    formData.append('model', selectedModel)
    formData.append('runner', selectedRunner)

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

  return {
    handleChange,
    handleSubmit,
    handleRemoveFile,
    isLoading,
    inputFileRef,
    selectedFiles,
    selectedModel,
    handleChangeModel,
    handleChangeRunner,
    selectedRunner,
  }
}
