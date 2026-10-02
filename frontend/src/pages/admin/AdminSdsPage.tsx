import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch } from '../../app/hooks'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { adminUploadSds } from '../../features/admin/adminThunks'

const emptyForm = {
  product_id: '',
  language: 'ar',
  version: '',
  issued_at: '',
  revision_notes: '',
}

export default function AdminSdsPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) return

    const data = new FormData()
    data.append('file', file)
    data.append('product_id', form.product_id)
    data.append('language', form.language)
    data.append('version', form.version)
    data.append('issued_at', form.issued_at)
    if (form.revision_notes) {
      data.append('revision_notes', form.revision_notes)
    }

    const result = await dispatch(adminUploadSds(data))
    if (adminUploadSds.fulfilled.match(result)) {
      setMessage(`${t('admin.upload')}: ${result.payload.file_url}`)
      setForm(emptyForm)
      setFile(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('admin.sds')}</h1>
      {message && <p className="mt-4 text-sm text-brand-700">{message}</p>}
      <Card className="mt-6">
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <Input label={t('admin.productId')} value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('product.language')}</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <Input label={t('admin.version')} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} required />
          <Input label={t('admin.issuedAt')} type="date" value={form.issued_at} onChange={(e) => setForm({ ...form, issued_at: e.target.value })} required />
          <Input
            label={t('admin.revisionNotes')}
            value={form.revision_notes}
            onChange={(e) => setForm({ ...form, revision_notes: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('admin.file')}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>
          <Button type="submit" className="sm:col-span-2">
            {t('admin.upload')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
