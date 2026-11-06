import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Input({ label, hint, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? rest.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`glass rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/25 ${className}`}
        {...rest}
      />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
