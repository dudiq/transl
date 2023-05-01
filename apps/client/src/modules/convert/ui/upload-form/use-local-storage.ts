import { useCallback, useEffect, useState } from 'react'

type Args<T> = {
  key: string
  defaultValue: T
}
export function useLocalStorage<T>({ key, defaultValue }: Args<T>) {
  const [storedValue, updateStoredValue] = useState(defaultValue)

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key) || ''
      const data = JSON.parse(storedValue)
      if (data) {
        updateStoredValue(data.value)
      }
    } catch (e: unknown) {}
  }, [])

  const handleSaveValue = useCallback((newValue: T) => {
    try {
      const data = JSON.stringify({ value: newValue })
      window.localStorage.setItem(key, data)
      updateStoredValue(newValue)
    } catch (e: unknown) {}
  }, [])

  return {
    storedValue,
    handleSaveValue,
  }
}
