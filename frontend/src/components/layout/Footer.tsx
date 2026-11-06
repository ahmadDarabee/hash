import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DropletIcon, ShieldCheckIcon } from '../icons'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mx-auto mt-16 w-full max-w-6xl px-4 pb-8 sm:px-5">
      <div className="glass rounded-3xl px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-lime text-white">
                <DropletIcon className="h-4 w-4" />
              </span>
              <span className="text-base font-extrabold text-ink">Hash</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/compliance" className="pressable inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
              <ShieldCheckIcon className="h-4 w-4 text-lime" />
              {t('nav.compliance')}
            </Link>
            <Link to="/products" className="pressable inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
              {t('nav.products')}
            </Link>
            <Link to="/quote" className="pressable inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-ink">
              {t('nav.quote')}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-line/70 pt-5 text-xs text-muted sm:flex-row">
          <span>
            Hash © {new Date().getFullYear()} — {t('footer.rights')}
          </span>
          <span className="font-mono">{t('footer.clinical')}</span>
        </div>
      </div>
    </footer>
  )
}
