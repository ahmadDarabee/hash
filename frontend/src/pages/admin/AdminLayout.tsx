import { useTranslation } from 'react-i18next'
import { Navigate, NavLink, Outlet } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'

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
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row">
      <aside className="w-full shrink-0 sm:w-48">
        <nav className="flex flex-row gap-2 sm:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
