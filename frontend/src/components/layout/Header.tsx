import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authThunks'
import { LanguageSwitcher } from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0))

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products') },
    { to: '/compliance', label: t('nav.compliance') },
    { to: '/quote', label: t('nav.quote') },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-700">
          Hash
        </Link>

        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {t('nav.cart')}: {cartCount}
          </span>
          <LanguageSwitcher />
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-brand-700">
                  {t('nav.admin')}
                </Link>
              )}
              <button
                onClick={() => void dispatch(logout())}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
