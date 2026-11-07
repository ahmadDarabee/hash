import { useTranslation } from 'react-i18next'

import { Badge } from '../components/ui/Badge'
import { FileTextIcon, ShieldCheckIcon, WarningIcon, LeafIcon } from '../components/icons'

export default function CompliancePage() {
  const { t } = useTranslation()

  const pillars = [
    { icon: FileTextIcon, title: t('compliance.sdsTitle'), text: t('compliance.sdsText'), tone: 'text-brand' },
    { icon: ShieldCheckIcon, title: t('compliance.safetyTitle'), text: t('compliance.safetyText'), tone: 'text-lime' },
    { icon: LeafIcon, title: t('compliance.ecoTile'), text: t('compliance.ecoText'), tone: 'text-lime' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5">
      <div className="text-center">
        <Badge tone="aqua" icon={<ShieldCheckIcon className="h-3 w-3" />}>
          {t('compliance.eyebrow')}
        </Badge>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('compliance.title')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">{t('compliance.subtitle')}</p>
      </div>

      {/* Disclaimer */}
      <div className="glass mt-8 overflow-hidden rounded-3xl border-amber/25">
        <div className="flex items-start gap-3 p-6">
          <WarningIcon className="h-5 w-5 shrink-0 text-amber" />
          <div>
            <h2 className="font-semibold text-amber">{t('compliance.disclaimerTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('compliance.disclaimer')}</p>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {pillars.map(({ icon: Icon, title, text, tone }) => (
          <div key={title} className="glass hover-lift rounded-3xl p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/5 ${tone}`}>
              <Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
