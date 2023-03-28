type CopyToClipboardFallback = ((text: string) => boolean) & {
  element: HTMLTextAreaElement | null
}

export const copyToClipboardFallback: CopyToClipboardFallback = (text) => {
  let { element } = copyToClipboardFallback

  if (!element) {
    element = document.createElement('textarea')

    element.style.display = 'none'
    document.body.appendChild(element)
    copyToClipboardFallback.element = element
  }

  element.value = text
  element.select()

  return document.execCommand('copy')
}

copyToClipboardFallback.element = null
