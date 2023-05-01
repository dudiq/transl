import React from 'react'
import { UploadForm } from './upload-form/upload.form'
import { Events } from './events'

export const MainPage = () => {
  return (
    <div className="m-2">
      <div className="flex items-center justify-center">
        <div className="text-md m-10">
          Welcome to the transl. Convert video to text locally with Whisper and
          nextjs
        </div>
      </div>
      <div className="gap-2 sm:flex">
        <div className="flex-1">
          <UploadForm />
        </div>
        <div className="flex-1">
          <Events />
        </div>
      </div>
    </div>
  )
}
