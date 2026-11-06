import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { WindowChrome } from '../components/ui/WindowChrome'
import { register } from '../features/auth/authThunks'
import type { CustomerType, Language } from '../types'
import { DropletIcon } from '../components/icons'

export default function RegisterPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const error = useAppSelector((state) => state.auth.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [customerType, setCustomerType] = useState<CustomerType>('b2c')
  const [companyName, setCompanyName] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('ar')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await dispatch(
      register({
        email,
        password,
        customer_type: customerType,
        preferred_language: preferredLanguage,
        company_name: customerType === 'b2b' ? companyName : undefined,
      }),
    )
    if (register.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-lime text-white shadow-glow">
        <DropletIcon className="h-7 w-7" />
      </span>

      <div className="glass-strong float-2 mt-6 w-full overflow-hidden rounded-3xl">
        <WindowChrome title="Hash — Create account" />
        <form onSubmit={onSubmit} className="p-6">
          <h1 className="text-2xl font-bold text-ink">{t('auth.registerTitle')}</h1>
          {error && (
            <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}
          <div className="mt-5 flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
            <Select
              label={t('auth.customerType')}
              value={customerType}
              onChange={(event) => setCustomerType(event.target.value as CustomerType)}
            >
              <option value="b2c">{t('auth.b2c')}</option>
              <option value="b2b">{t('auth.b2b')}</option>
            </Select>
            {customerType === 'b2b' && (
              <Input
                label={t('auth.companyName')}
                name="company_name"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                required
              />
            )}
            <Select
              label={t('auth.preferredLanguage')}
              value={preferredLanguage}
              onChange={(event) => setPreferredLanguage(event.target.value as Language)}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </Select>
            <Button type="submit" size="lg" className="w-full">
              {t('auth.registerCta')}
            </Button>
          </div>
          <p className="mt-5 text-center text-sm text-muted">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              {t('nav.login')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
