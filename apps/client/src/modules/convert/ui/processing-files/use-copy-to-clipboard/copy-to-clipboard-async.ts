export async function copyToClipboardAsync(text: string): Promise<boolean> {
  try {
    await window.navigator.clipboard.writeText(text)

    return true
  } catch {
    return false
  }
}
