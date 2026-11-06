import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { WindowChrome } from '../components/ui/WindowChrome'
import { useToast } from '../components/ui/Toast'
import { useProductProfile } from '../features/catalog/useProductProfile'
import { requestQuote } from '../services/endpoints'
import { CheckIcon, DropletIcon, QuoteIcon } from '../components/icons'

export default function QuotePage() {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const items = useAppSelector((state) => state.cart.items)
  const profileOf = useProductProfile()
  const lang = i18n.language

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const lineItems = items
        .map(({ product, qty }) => {
          const name = lang === 'ar' ? product.name_ar : product.name_en
          const profile = profileOf(product)
          return `- ${name} (${product.sku}) × ${qty} — ${profile.dilutionRatio}`
        })
        .join('\n')
      const composedNotes = [notes, lineItems ? `\n${t('quote.items')}:\n${lineItems}` : '']
        .filter(Boolean)
        .join('\n')

      await requestQuote({
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        company_name: companyName || undefined,
        notes: composedNotes || undefined,
      })
      setSuccess(true)
      toast(t('quote.success'))
    } catch {
      toast(t('quote.failed'), 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5">
      <div className="text-center">
        <Badge tone="aqua" icon={<QuoteIcon className="h-3 w-3" />}>
          {t('quote.b2b')}
        </Badge>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('quote.title')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">{t('quote.subtitle')}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="glass-strong float-2 overflow-hidden rounded-3xl lg:col-span-2">
          <WindowChrome title="Hash — Request a quote" />
          {success ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime/15 text-lime">
                <CheckIcon className="h-7 w-7 animate-check-pop" />
              </span>
              <p className="text-lg font-semibold text-ink">{t('quote.success')}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
              <Input
                label={t('quote.contactName')}
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                required
              />
              <Input
                label={t('quote.contactEmail')}
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                required
              />
              <Input
                label={t('quote.contactPhone')}
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
              />
              <Input
                label={t('quote.companyName')}
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="quote-notes" className="text-sm font-medium text-ink">
                  {t('quote.notes')}
                </label>
                <textarea
                  id="quote-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="glass rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/25"
                />
              </div>
              <Button type="submit" size="lg" loading={submitting} className="sm:col-span-2">
                {t('quote.submit')}
              </Button>
            </form>
          )}
        </div>

        {/* Quote list summary */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <DropletIcon className="h-5 w-5" />
            </span>
            <h2 className="font-bold text-ink">{t('quote.list')}</h2>
          </div>

          {items.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t('cart.empty')}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map(({ product, qty }) => {
                const name = lang === 'ar' ? product.name_ar : product.name_en
                const profile = profileOf(product)
                return (
                  <li key={product.id} className="rounded-2xl bg-ink/5 p-3">
                    <p className="text-sm font-semibold text-ink">{name}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      {product.sku} × {qty}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone="aqua">{profile.phBand}</Badge>
                      <Badge tone="neutral">{profile.dilutionRatio}</Badge>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
