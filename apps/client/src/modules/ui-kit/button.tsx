import { ReactNode } from 'react'
import { Loader } from '~/modules/ui-kit/loader'

type Props = {
  type?: 'submit' | 'button'
  isLoading?: boolean
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
}
export function Button({
  type = 'button',
  isLoading,
  disabled,
  children,
  onClick,
}: Props) {
  return (
    <>
      <button
        disabled={disabled}
        type={type}
        onClick={onClick}
        className="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {children}
        {isLoading && <Loader />}
      </button>
    </>
  )
}
