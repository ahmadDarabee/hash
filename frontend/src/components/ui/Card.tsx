import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  interactive?: boolean
}

export function Card({ className = '', glass = false, interactive = false, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl ${glass ? 'glass' : 'bg-surface border border-line'} ${
        interactive ? 'hover-lift pressable cursor-pointer' : ''
      } ${className}`}
      {...rest}
    />
  )
}
