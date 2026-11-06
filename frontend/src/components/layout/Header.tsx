import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authThunks'
import { useTheme } from '../../theme'
import { useCommandPalette } from '../ui/CommandPalette'
import { useCartDrawer } from '../cart/CartDrawer'
import { LanguageSwitcher } from './LanguageSwitcher'
import {
  CartIcon,
  CloseIcon,
  CommandIcon,
  DropletIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from '../icons'

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0))
  const { theme, toggle } = useTheme()
  const { open: openPalette } = useCommandPalette()
  const { open: openCart } = useCartDrawer()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/products', label: t('nav.products') },
    { to: '/compliance', label: t('nav.compliance') },
    { to: '/quote', label: t('nav.quote') },
  ]

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass-strong mx-auto flex max-w-6xl items-center gap-2 rounded-2xl px-3 py-2 shadow-float">
        {/* Logo */}
        <Link to="/" className="pressable flex shrink-0 items-center gap-2.5 pe-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-lime text-white shadow-glow">
            <DropletIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">Hash</span>
        </Link>

        {/* Pill nav (desktop) */}
        <nav className="mx-auto hidden items-center gap-1 rounded-full bg-ink/5 p-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `pressable rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand/15 text-brand glow-active'
                    : 'text-muted hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="ms-auto flex items-center gap-1.5">
          <button
            onClick={openPalette}
            className="pressable hidden items-center gap-2 rounded-full border border-line/70 bg-surface/50 px-3 py-1.5 text-sm text-muted hover:border-brand/40 hover:text-ink sm:flex"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden md:inline">{t('nav.search')}</span>
            <kbd className="hidden items-center gap-0.5 rounded-md border border-line bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-muted md:flex">
              <CommandIcon className="h-3 w-3" />
              K
            </kbd>
          </button>

          <button
            onClick={toggle}
            className="pressable flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
            aria-label={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
          >
            {theme === 'dark' ? <SunIcon className="h-[18px] w-[18px]" /> : <MoonIcon className="h-[18px] w-[18px]" />}
          </button>

          <LanguageSwitcher />

          {/* Desktop auth */}
          <div className="ms-1 hidden items-center gap-1.5 lg:flex">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="pressable rounded-full px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <span className="max-w-32 truncate rounded-full bg-ink/5 px-3 py-1.5 text-xs font-medium text-muted">
                  {user.email}
                </span>
                <button
                  onClick={() => void dispatch(logout())}
                  className="pressable rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-ink/5 hover:text-ink"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="pressable rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-ink/5 hover:text-ink"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="pressable rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-glow hover:brightness-110"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={openCart}
            className="pressable relative flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
            aria-label={t('nav.cart')}
          >
            <CartIcon className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-[#1a2e05]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="pressable flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink lg:hidden"
            aria-label={t('nav.menu')}
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-strong mx-auto mt-2 max-w-6xl animate-scale-in rounded-2xl p-2 shadow-float lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `pressable rounded-xl px-3 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-brand/15 text-brand' : 'text-muted hover:bg-ink/5 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-2 flex items-center gap-2 border-t border-line/70 pt-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="pressable rounded-xl px-3 py-2 text-sm font-semibold text-brand">
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={() => void dispatch(logout())}
                  className="pressable rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:text-ink"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="pressable rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="pressable rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
