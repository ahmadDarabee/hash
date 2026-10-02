import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import type { WojakMood } from '../../features/wojak/wojakSlice'

type Expression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'confused'
  | 'excited'
  | 'error'
  | 'loading'

// Map reactive moods to one of a handful of simple expressions.
const EXPRESSION: Record<WojakMood, Expression> = {
  idle: 'neutral',
  happy: 'happy',
  sad: 'sad',
  confused: 'confused',
  excited: 'excited',
  loading: 'loading',
  error: 'error',
  login_success: 'happy',
  logout: 'sad',
  add_to_cart: 'happy',
  cancel_order: 'sad',
  empty_cart: 'sad',
  first_visit: 'excited',
  language_switch: 'excited',
}

const STROKE = '#27272a'

const EYES: Record<Expression, ReactNode> = {
  neutral: (
    <>
      <circle cx="45" cy="54" r="4" fill={STROKE} />
      <circle cx="75" cy="54" r="4" fill={STROKE} />
    </>
  ),
  happy: (
    <>
      <path d="M40 56 Q45 49 50 56" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <path d="M70 56 Q75 49 80 56" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <path d="M40 51 Q45 57 50 51" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <path d="M70 51 Q75 57 80 51" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  confused: (
    <>
      <circle cx="45" cy="54" r="4" fill={STROKE} />
      <circle cx="75" cy="54" r="4" fill={STROKE} />
      <path d="M71 43 q5 -4 10 0" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <circle cx="45" cy="54" r="6" fill={STROKE} />
      <circle cx="75" cy="54" r="6" fill={STROKE} />
    </>
  ),
  error: (
    <>
      <path d="M41 50 L49 58 M49 50 L41 58" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      <path d="M71 50 L79 58 M79 50 L71 58" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  loading: (
    <>
      <line x1="40" y1="54" x2="50" y2="54" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="70" y1="54" x2="80" y2="54" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}

const MOUTH: Record<Expression, ReactNode> = {
  neutral: <line x1="52" y1="80" x2="68" y2="80" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />,
  happy: <path d="M50 78 Q60 90 70 78" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />,
  sad: <path d="M50 84 Q60 73 70 84" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />,
  confused: <path d="M50 80 Q55 76 60 80 T70 80" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />,
  excited: <path d="M48 78 Q60 96 72 78 Z" fill={STROKE} />,
  error: <line x1="52" y1="82" x2="68" y2="82" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />,
  loading: <circle cx="60" cy="80" r="4" fill="none" stroke={STROKE} strokeWidth="3" />,
}

interface WojakFaceProps {
  mood: WojakMood
  pokeToken: number
  className?: string
}

export function WojakFace({ mood, pokeToken, className = '' }: WojakFaceProps) {
  const [poking, setPoking] = useState(false)
  const prevPoke = useRef(pokeToken)

  useEffect(() => {
    if (pokeToken === prevPoke.current) return
    prevPoke.current = pokeToken
    setPoking(true)
    const timer = setTimeout(() => setPoking(false), 400)
    return () => clearTimeout(timer)
  }, [pokeToken])

  const expression = EXPRESSION[mood]

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${poking ? 'wojak-poke ' : ''}${className}`}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="64" rx="42" ry="46" fill="#f4f4f5" stroke={STROKE} strokeWidth="4" />
      <path
        d="M44 28 Q42 18 60 20 Q78 18 76 28"
        fill="none"
        stroke={STROKE}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {EYES[expression]}
      {MOUTH[expression]}
    </svg>
  )
}
