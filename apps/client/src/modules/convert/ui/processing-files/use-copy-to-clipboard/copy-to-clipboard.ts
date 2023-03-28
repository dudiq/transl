import { copyToClipboardAsync } from './copy-to-clipboard-async'
import { copyToClipboardFallback } from './copy-to-clipboard-fallback'

export async function copyToClipboard(text: string): Promise<boolean> {
  let isCopied = false

  try {
    isCopied = await copyToClipboardAsync(text)

    if (!isCopied) {
      isCopied = copyToClipboardFallback(text)
    }

    return isCopied
  } catch {
    return isCopied
  }
}
