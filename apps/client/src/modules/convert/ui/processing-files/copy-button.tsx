import { useCopyToClipboard } from './use-copy-to-clipboard/use-copy-to-clipboard'
import { Button } from '~/modules/ui-kit/button'
import React, { useEffect, useState } from 'react'

type Props = {
  text: string
}

export function CopyButton({ text }: Props) {
  const { handleCopy } = useCopyToClipboard()
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setCopied(false)
      }, 5000)
    }
  }, [isCopied])

  return (
    <>
      <Button
        onClick={() => {
          setCopied(true)
          handleCopy(text)
        }}
      >
        {isCopied ? 'Copied' : 'Copy text'}
      </Button>
    </>
  )
}
