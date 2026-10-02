import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import {
  adminCreateProduct,
  adminListProducts,
  adminUpdateProduct,
} from '../../features/admin/adminThunks'
import type { Product } from '../../types'

const emptyForm = {
  sku: '',
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  category_id: '',
  brand: '',
  unit: '',
  kind: 'finished',
}

export default function AdminProductsPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, status } = useAppSelector((state) => state.admin)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Product | null>(null)

  const lang = i18n.language

  useEffect(() => {
    void dispatch(adminListProducts({ page: 1, page_size: 100 }))
  }, [dispatch])

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await dispatch(
      adminCreateProduct({
        sku: form.sku,
        name_en: form.name_en,
        name_ar: form.name_ar,
        description_en: form.description_en || null,
        description_ar: form.description_ar || null,
        category_id: Number(form.category_id),
        brand: form.brand,
        unit: form.unit,
        kind: form.kind === 'raw' ? 'raw' : 'finished',
      }),
    )
    setForm(emptyForm)
    setShowForm(false)
  }

  async function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) return
    await dispatch(
      adminUpdateProduct({
        id: editing.id,
        changes: {
          name_en: editing.name_en,
          name_ar: editing.name_ar,
          brand: editing.brand,
          unit: editing.unit,
          is_active: editing.is_active,
        },
      }),
    )
    setEditing(null)
  }

  function updateEditing(patch: Partial<Product>) {
    setEditing((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin.products')}</h1>
        <Button variant="secondary" onClick={() => setShowForm((value) => !value)}>
          {showForm ? t('common.cancel') : t('admin.newProduct')}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Input label={t('admin.sku')} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input label={t('admin.brand')} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            <Input label={t('admin.nameEn')} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
            <Input label={t('admin.nameAr')} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
            <Input label={t('admin.descriptionEn')} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
            <Input label={t('admin.descriptionAr')} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
            <Input label={t('admin.categoryId')} type="number" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required />
            <Input label={t('admin.unit')} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="finished">finished</option>
              <option value="raw">raw</option>
            </select>
            <Button type="submit" className="sm:col-span-2">
              {t('admin.create')}
            </Button>
          </form>
        </Card>
      )}

      {status === 'loading' && <Spinner className="mt-6" />}

      <div className="mt-6 space-y-3">
        {products.map((product) =>
          editing?.id === product.id ? (
            <Card key={product.id}>
              <form onSubmit={onUpdate} className="grid gap-3 sm:grid-cols-2">
                <Input label={t('admin.nameEn')} value={editing.name_en} onChange={(e) => updateEditing({ name_en: e.target.value })} />
                <Input label={t('admin.nameAr')} value={editing.name_ar} onChange={(e) => updateEditing({ name_ar: e.target.value })} />
                <Input label={t('admin.brand')} value={editing.brand} onChange={(e) => updateEditing({ brand: e.target.value })} />
                <Input label={t('admin.unit')} value={editing.unit} onChange={(e) => updateEditing({ unit: e.target.value })} />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={editing.is_active} onChange={(e) => updateEditing({ is_active: e.target.checked })} />
                  {t('admin.isActive')}
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit">{t('admin.update')}</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card key={product.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{lang === 'ar' ? product.name_ar : product.name_en}</p>
                <p className="text-sm text-gray-500">
                  {product.sku} · {product.brand} · {product.is_active ? t('admin.isActive') : '-'}
                </p>
              </div>
              <Button variant="secondary" onClick={() => setEditing(product)}>
                {t('common.edit')}
              </Button>
            </Card>
          ),
        )}
      </div>
    </div>
  )
}
