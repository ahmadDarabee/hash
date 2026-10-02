import { useTranslation } from 'react-i18next'

import { Card } from '../components/ui/Card'
import { WarningIcon } from '../components/icons'

export default function CompliancePage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t('compliance.title')}</h1>
      <p className="mt-2 text-gray-600">{t('compliance.subtitle')}</p>

      <Card className="mt-6 border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <WarningIcon className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h2 className="font-semibold text-amber-900">{t('compliance.disclaimerTitle')}</h2>
            <p className="mt-2 text-sm text-amber-800">{t('compliance.disclaimer')}</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold">{t('compliance.sdsTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('compliance.sdsText')}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">{t('compliance.safetyTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('compliance.safetyText')}</p>
        </Card>
      </div>
    </div>
  )
}
