import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { login } from '../features/auth/authThunks'

export default function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const error = useAppSelector((state) => state.auth.error)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold">{t('auth.loginTitle')}</h1>
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
          required
        />
        <Button type="submit">{t('auth.loginCta')}</Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="text-brand-700 hover:underline">
          {t('nav.register')}
        </Link>
      </p>
    </form>
  )
}
