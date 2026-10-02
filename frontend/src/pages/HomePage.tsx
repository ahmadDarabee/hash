import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-xl bg-brand-600 p-10 text-white">
        <h1 className="text-3xl font-bold">Hash</h1>
        <p className="mt-2 max-w-xl text-brand-50">{t('footer.tagline')}</p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/products"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            {t('nav.products')}
          </Link>
          <Link
            to="/quote"
            className="rounded-md border border-white px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t('nav.quote')}
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link to="/products" className="rounded-lg border border-gray-200 bg-white p-6 hover:border-brand-300">
          <h2 className="font-semibold text-gray-900">{t('nav.products')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('catalog.title')}</p>
        </Link>
        <Link to="/compliance" className="rounded-lg border border-gray-200 bg-white p-6 hover:border-brand-300">
          <h2 className="font-semibold text-gray-900">{t('nav.compliance')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('compliance.subtitle')}</p>
        </Link>
        <Link to="/quote" className="rounded-lg border border-gray-200 bg-white p-6 hover:border-brand-300">
          <h2 className="font-semibold text-gray-900">{t('nav.quote')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('quote.subtitle')}</p>
        </Link>
      </section>
    </div>
  )
}
