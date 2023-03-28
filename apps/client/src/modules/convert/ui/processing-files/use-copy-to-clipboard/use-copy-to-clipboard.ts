import { useCallback } from 'react'

import { copyToClipboard } from './copy-to-clipboard'

export function useCopyToClipboard() {
  const handleCopy = useCallback(async (value: string) => {
    const isCopied = await copyToClipboard(value)

    return isCopied
  }, [])

  return {
    handleCopy,
  }
}
