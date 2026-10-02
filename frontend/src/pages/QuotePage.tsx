import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { getErrorMessage } from '../services/api'
import { requestQuote } from '../services/endpoints'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const empty = {
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  company_name: '',
  notes: '',
}

export default function QuotePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(empty)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof typeof empty) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    try {
      await requestQuote(form)
      setDone(true)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (done) {
    return (
      <p className="mx-auto max-w-md px-4 py-12 text-center font-medium text-brand-700">
        {t('quote.success')}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">{t('quote.title')}</h1>
      <p className="mt-1 text-gray-600">{t('quote.subtitle')}</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex flex-col gap-4">
        <Input label={t('quote.contactName')} name="contact_name" value={form.contact_name} onChange={update('contact_name')} required />
        <Input label={t('quote.contactEmail')} type="email" name="contact_email" value={form.contact_email} onChange={update('contact_email')} required />
        <Input label={t('quote.contactPhone')} name="contact_phone" value={form.contact_phone} onChange={update('contact_phone')} />
        <Input label={t('quote.companyName')} name="company_name" value={form.company_name} onChange={update('company_name')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('quote.notes')}</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={update('notes')}
            rows={4}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <Button type="submit">{t('quote.submit')}</Button>
      </div>
    </form>
  )
}
