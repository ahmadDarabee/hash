import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { adminListProducts, adminListUsers } from '../../features/admin/adminThunks'
import { FileTextIcon, UsersIcon, BoxIcon, LayersIcon } from '../../components/icons'

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { productTotal, userTotal, status } = useAppSelector((state) => state.admin)

  useEffect(() => {
    void dispatch(adminListProducts({ page: 1, page_size: 1 }))
    void dispatch(adminListUsers({ page: 1, page_size: 1 }))
  }, [dispatch])

  const actions = [
    { to: '/admin/products', label: t('admin.products'), description: t('admin.manageProducts'), icon: BoxIcon },
    { to: '/admin/sds', label: t('admin.sds'), description: t('admin.uploadSds'), icon: FileTextIcon },
    { to: '/admin/users', label: t('admin.users'), description: t('admin.manageUsers'), icon: UsersIcon },
  ]

  const comingSoon = [t('admin.orders'), t('admin.inventory'), t('admin.reports')]

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{t('admin.title')}</h1>
      <p className="mt-1 text-muted">{t('admin.subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <p className="text-sm text-muted">{t('admin.products')}</p>
          <p className="mt-2 text-4xl font-extrabold text-ink">{status === 'loading' ? '…' : productTotal}</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-sm text-muted">{t('admin.users')}</p>
          <p className="mt-2 text-4xl font-extrabold text-ink">{userTotal}</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-ink">{t('admin.quickActions')}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {actions.map(({ to, label, description, icon: Icon }) => (
          <Link key={to} to={to} className="glass hover-lift group rounded-3xl p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-semibold text-ink">{label}</p>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-ink">{t('admin.comingSoon')}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {comingSoon.map((label) => (
          <span key={label} className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted">
            <LayersIcon className="h-3.5 w-3.5" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
