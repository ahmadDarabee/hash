import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { BackendWojakChatService } from '../../features/wojak/WojakChatService'
import { addMessage, setMood, setTyping, type WojakMood } from '../../features/wojak/wojakSlice'
import { SendIcon } from '../icons'

export function WojakChatPanel() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { messages, typing } = useAppSelector((state) => state.wojak)
  const [input, setInput] = useState('')
  const service = useRef(new BackendWojakChatService())

  async function send() {
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    dispatch(addMessage({ role: 'user', text }))
    dispatch(setTyping(true))
    try {
      const reply = await service.current.reply(text)
      dispatch(addMessage({ role: 'wojak', text: reply.text }))
      dispatch(setMood(reply.state as WojakMood))
    } finally {
      dispatch(setTyping(false))
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void send()
  }

  return (
    <div className="flex w-72 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800">
        {t('wojak.chat.title')}
      </div>

      <div className="flex h-64 flex-col gap-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400">{t('wojak.chat.placeholder')}</p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'self-end bg-brand-600 text-white'
                : 'self-start bg-gray-100 text-gray-800'
            }`}
          >
            {message.text}
          </div>
        ))}
        {typing && (
          <div className="self-start rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-400">...</div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-gray-200 p-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('wojak.chat.placeholder')}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={t('wojak.chat.send')}
          className="rounded-md bg-brand-600 p-2 text-white hover:bg-brand-700"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
