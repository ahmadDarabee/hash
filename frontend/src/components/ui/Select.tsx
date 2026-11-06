import type { SelectHTMLAttributes } from 'react'

import { ChevronDownIcon } from '../icons'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, id, className = '', children, ...rest }: SelectProps) {
  const selectId = id ?? rest.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`glass w-full appearance-none rounded-xl px-3.5 py-2.5 pe-9 text-sm text-ink transition focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/25 ${className}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  )
}
