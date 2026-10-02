import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import i18n from '../../i18n'
import {
  setChatOpen,
  setMood,
  setVisible,
  toggleVisible,
  triggerPoke,
  type WojakMood,
} from '../../features/wojak/wojakSlice'
import { ChatIcon, CloseIcon } from '../icons'
import { RiveCharacter } from './RiveCharacter'
import { WojakChatPanel } from './WojakChatPanel'

const RIVE_SRC = '/rive/wojak.riv'

const REACTION_MOODS: WojakMood[] = [
  'first_visit',
  'login_success',
  'logout',
  'add_to_cart',
  'cancel_order',
  'empty_cart',
  'language_switch',
  'error',
]

export default function Wojak() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { visible, mood, poke, chatOpen } = useAppSelector((state) => state.wojak)
  const [caption, setCaption] = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem('hash.visited')) {
      localStorage.setItem('hash.visited', '1')
      dispatch(setMood('first_visit'))
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem('hash.wojak.visible', String(visible))
  }, [visible])

  useEffect(() => {
    if (!REACTION_MOODS.includes(mood)) return
    const lines = i18n.t(`wojak.reactions.${mood}`, {
      returnObjects: true,
      defaultValue: [] as string[],
    }) as unknown
    const arr = Array.isArray(lines) ? lines : []
    if (arr.length === 0) return

    setCaption(arr[Math.floor(Math.random() * arr.length)])
    const timer = setTimeout(() => setCaption(null), 4000)
    return () => clearTimeout(timer)
  }, [mood])

  if (!visible) {
    return (
      <button
        onClick={() => dispatch(setVisible(true))}
        className="fixed bottom-4 end-4 z-50 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-brand-700"
      >
        {t('wojak.toggle.show')}
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-2">
      {chatOpen && <WojakChatPanel />}

      {caption && (
        <div className="max-w-52 rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-md">
          {caption}
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          onClick={() => dispatch(toggleVisible())}
          aria-label={t('wojak.toggle.hide')}
          className="mb-2 rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => dispatch(triggerPoke())}
          aria-label={t('wojak.name')}
          className="relative"
        >
          <RiveCharacter
            src={RIVE_SRC}
            stateMachine="Wojak"
            mood={mood}
            pokeToken={poke}
            className="h-28 w-28"
            fallback={
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-100 text-4xl font-bold text-brand-700">
                W
              </span>
            }
          />
        </button>

        <button
          onClick={() => dispatch(setChatOpen(!chatOpen))}
          aria-label={t('wojak.chat.open')}
          className="mb-2 rounded-full bg-brand-600 p-2 text-white hover:bg-brand-700"
        >
          <ChatIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
