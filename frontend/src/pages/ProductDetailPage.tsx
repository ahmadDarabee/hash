import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { addItem } from '../features/cart/cartSlice'
import { fetchProduct, fetchProductSds, fetchProductWarnings } from '../features/catalog/catalogThunks'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { selected, sds, warnings, status } = useAppSelector((state) => state.catalog)

  const lang = i18n.language

  useEffect(() => {
    if (id) {
      void dispatch(fetchProduct(id))
      void dispatch(fetchProductSds(id))
      void dispatch(fetchProductWarnings(id))
    }
  }, [dispatch, id])

  if (!selected) {
    return status === 'error' ? (
      <p className="mx-auto mt-16 text-center text-gray-500">{t('common.notFound')}</p>
    ) : (
      <Spinner className="mx-auto mt-16" />
    )
  }

  const localizedSds = sds.filter((doc) => doc.language === lang)
  const localizedWarnings = warnings.filter((warning) => warning.language === lang)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{lang === 'ar' ? selected.name_ar : selected.name_en}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {t('catalog.brand')}: {selected.brand} · {t('catalog.unit')}: {selected.unit} · {t('catalog.sku')}: {selected.sku}
      </p>
      <p className="mt-4 text-gray-700">{lang === 'ar' ? selected.description_ar : selected.description_en}</p>

      <Button onClick={() => dispatch(addItem(selected))} className="mt-6">
        {t('catalog.addToCart')}
      </Button>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{t('product.sds')}</h2>
        {localizedSds.length === 0 ? (
          <p className="mt-2 text-gray-500">{t('product.noSds')}</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200">
            {localizedSds.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">
                  {t('product.version')}: {doc.version} · {t('product.issuedAt')}: {doc.issued_at}
                </span>
                <a href={doc.file_url} download className="text-sm font-medium text-brand-700 hover:underline">
                  {t('product.download')}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{t('product.warnings')}</h2>
        {localizedWarnings.length === 0 ? (
          <p className="mt-2 text-gray-500">{t('product.noWarnings')}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {localizedWarnings.map((warning) => (
              <li
                key={warning.id}
                className={`rounded-md border p-3 text-sm ${
                  warning.severity === 'danger'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : warning.severity === 'warning'
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-blue-200 bg-blue-50 text-blue-800'
                }`}
              >
                <span className="font-semibold">{t(`severity.${warning.severity}`)}:</span> {warning.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
