import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">{t('footer.tagline')}</p>
        <div className="flex items-center gap-4">
          <Link to="/compliance" className="text-sm text-gray-500 hover:text-gray-900">
            {t('nav.compliance')}
          </Link>
          <span className="text-xs text-gray-400">
            Hash © {new Date().getFullYear()} — {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  )
}
