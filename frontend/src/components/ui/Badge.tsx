import type { ReactNode } from 'react'

type Tone = 'neutral' | 'aqua' | 'lime' | 'amber' | 'danger'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink/5 text-ink border-ink/10',
  aqua: 'bg-brand/10 text-brand border-brand/25',
  lime: 'bg-lime/15 text-lime border-lime/25',
  amber: 'bg-amber/15 text-amber border-amber/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
}

interface BadgeProps {
  tone?: Tone
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', icon, className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
