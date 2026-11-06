import { useTranslation } from 'react-i18next'
import { Navigate, NavLink, Outlet } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'
import { DropletIcon } from '../../components/icons'

export default function AdminLayout() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  const links: Array<{ to: string; label: string; end?: boolean }> = [
    { to: '/admin', label: t('admin.dashboard'), end: true },
    { to: '/admin/products', label: t('admin.products') },
    { to: '/admin/sds', label: t('admin.sds') },
    { to: '/admin/users', label: t('admin.users') },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-5 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <div className="glass rounded-2xl p-3">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-lime text-white">
              <DropletIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-ink">{t('admin.title')}</span>
          </div>
          <nav className="mt-2 flex flex-row gap-1 lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `pressable rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-brand/15 text-brand glow-active' : 'text-muted hover:bg-ink/5 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
