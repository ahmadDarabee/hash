import type { ButtonHTMLAttributes } from 'react'

import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'lime' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-glow hover:brightness-110 active:brightness-95 border border-transparent',
  secondary:
    'glass text-ink hover:shadow-float border',
  ghost: 'bg-transparent text-muted hover:bg-ink/5 hover:text-ink border border-transparent',
  danger:
    'bg-danger text-white hover:brightness-110 border border-transparent',
  lime: 'bg-lime text-[#1a2e05] hover:brightness-105 border border-transparent',
  outline: 'bg-transparent text-ink border border-line hover:border-brand hover:text-brand',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`pressable inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
