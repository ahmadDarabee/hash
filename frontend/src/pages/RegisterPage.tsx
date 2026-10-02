import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { register } from '../features/auth/authThunks'
import type { CustomerType, Language } from '../types'

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
    <form onSubmit={onSubmit} className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold">{t('auth.registerTitle')}</h1>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex flex-col gap-4">
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
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('auth.customerType')}</label>
          <select
            value={customerType}
            onChange={(event) => setCustomerType(event.target.value as CustomerType)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="b2c">{t('auth.b2c')}</option>
            <option value="b2b">{t('auth.b2b')}</option>
          </select>
        </div>
        {customerType === 'b2b' && (
          <Input
            label={t('auth.companyName')}
            name="company_name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            required
          />
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('auth.preferredLanguage')}</label>
          <select
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value as Language)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
        <Button type="submit">{t('auth.registerCta')}</Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="text-brand-700 hover:underline">
          {t('nav.login')}
        </Link>
      </p>
    </form>
  )
}
