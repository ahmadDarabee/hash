import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Card } from '../../components/ui/Card'
import { adminListProducts, adminListUsers } from '../../features/admin/adminThunks'

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { productTotal, userTotal, status } = useAppSelector((state) => state.admin)

  useEffect(() => {
    void dispatch(adminListProducts({ page: 1, page_size: 1 }))
    void dispatch(adminListUsers({ page: 1, page_size: 1 }))
  }, [dispatch])

  const actions = [
    { to: '/admin/products', label: t('admin.products'), description: t('admin.manageProducts') },
    { to: '/admin/sds', label: t('admin.sds'), description: t('admin.uploadSds') },
    { to: '/admin/users', label: t('admin.users'), description: t('admin.manageUsers') },
  ]

  const comingSoon = [t('admin.orders'), t('admin.inventory'), t('admin.reports')]

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
      <p className="mt-1 text-gray-600">{t('admin.subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-gray-500">{t('admin.products')}</p>
          <p className="mt-1 text-3xl font-bold">{status === 'loading' ? '…' : productTotal}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">{t('admin.users')}</p>
          <p className="mt-1 text-3xl font-bold">{userTotal}</p>
        </Card>
      </div>

      <h2 className="mt-8 text-lg font-semibold">{t('admin.quickActions')}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-brand-300"
          >
            <p className="font-semibold text-gray-900">{action.label}</p>
            <p className="mt-1 text-sm text-gray-600">{action.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">{t('admin.comingSoon')}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {comingSoon.map((label) => (
          <span key={label} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
