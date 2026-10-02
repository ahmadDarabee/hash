import type { Middleware } from '@reduxjs/toolkit'

import { setMood, type WojakMood } from './wojakSlice'

interface ReactionRule {
  match: (type: string) => boolean
  mood: WojakMood
}

// Maps app actions to Wojak moods. Order matters: first match wins.
const reactionRules: ReactionRule[] = [
  { match: (type) => type === 'auth/login/fulfilled', mood: 'login_success' },
  { match: (type) => type === 'auth/register/fulfilled', mood: 'login_success' },
  { match: (type) => type === 'auth/logout/fulfilled', mood: 'logout' },
  { match: (type) => type === 'cart/addItem', mood: 'add_to_cart' },
  { match: (type) => type === 'cart/clearCart', mood: 'empty_cart' },
  { match: (type) => type === 'i18n/setLanguage', mood: 'language_switch' },
  { match: (type) => type.endsWith('/rejected'), mood: 'error' },
]

export const wojakBus: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  const type = (action as { type?: string }).type ?? ''
  for (const rule of reactionRules) {
    if (rule.match(type)) {
      store.dispatch(setMood(rule.mood))
      break
    }
  }
  return result
}
