import { ChangeEvent, ReactNode, useCallback } from 'react'

type Props<T extends string> = {
  onChange: (value: T) => void
  children: ReactNode
  label?: string
  value?: T
}

export function Dropdown<T extends string>({
  children,
  onChange,
  label,
  value,
}: Props<T>) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as T)
    },
    [onChange]
  )
  return (
    <>
      <label>
        <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
        <select
          value={value}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {children}
        </select>
      </label>
    </>
  )
}

const Option = ({ title, value }: { title: string; value: string }) => {
  return <option value={value}>{title}</option>
}

Dropdown.Option = Option
