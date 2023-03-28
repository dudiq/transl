import { ReactNode } from 'react'

export type BadgeType = 'blue' | 'green' | 'yellow'

type Props = {
  status: BadgeType
  children: ReactNode
}

const typeMap: Record<BadgeType, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  yellow:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
}

export function Badge({ status, children }: Props) {
  const typeClass = typeMap[status]
  return (
    <>
      <span
        className={`${typeClass} mr-2 rounded px-2.5 py-0.5 text-xs font-medium`}
      >
        {children}
      </span>
    </>
  )
}
