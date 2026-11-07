import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { login } from '../features/auth/authThunks'
import { DropletIcon } from '../components/icons'

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
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-lime text-white shadow-glow">
        <DropletIcon className="h-7 w-7" />
      </span>

      <div className="glass-strong float-2 mt-6 w-full overflow-hidden rounded-3xl">
        <form onSubmit={onSubmit} className="p-6">
          <h1 className="text-2xl font-bold text-ink">{t('auth.loginTitle')}</h1>
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
              required
            />
            <Button type="submit" size="lg" className="w-full">
              {t('auth.loginCta')}
            </Button>
          </div>
          <p className="mt-5 text-center text-sm text-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-brand hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
