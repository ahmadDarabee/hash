import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { adminAssignPricing, adminListUsers } from '../../features/admin/adminThunks'
import type { User } from '../../types'

function UserRow({ user }: { user: User }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [priceListId, setPriceListId] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!priceListId) return
    void dispatch(adminAssignPricing({ userId: user.id, priceListId }))
  }

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-semibold">{user.email}</p>
        <p className="text-sm text-gray-500">
          {t('admin.role')}: {user.role} · {t('admin.type')}: {user.customer_type}
        </p>
      </div>
      {user.customer_type === 'b2b' && (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            placeholder={t('admin.priceListId')}
            value={priceListId}
            onChange={(event) => setPriceListId(event.target.value)}
            className="w-44"
          />
          <Button type="submit">{t('admin.assignPricing')}</Button>
        </form>
      )}
    </Card>
  )
}

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.admin)

  useEffect(() => {
    void dispatch(adminListUsers({ page: 1, page_size: 100 }))
  }, [dispatch])

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('admin.users')}</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
