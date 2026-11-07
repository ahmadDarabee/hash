import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { DilutionCalculator } from '../components/ui/DilutionCalculator'
import { useToast } from '../components/ui/Toast'
import { fetchProduct, fetchProductMedia, fetchProductSds, fetchProductWarnings } from '../features/catalog/catalogThunks'
import { useProductProfile } from '../features/catalog/useProductProfile'
import {
  CopyIcon,
  DownloadIcon,
  DropletIcon,
  FileTextIcon,
  FlaskIcon,
  LeafIcon,
  ShieldCheckIcon,
  WarningIcon,
} from '../components/icons'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { selected, sds, warnings, status } = useAppSelector((state) => state.catalog)
  const profileOf = useProductProfile()
  const { toast } = useToast()

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
      <p className="mx-auto mt-16 text-center text-muted">{t('common.notFound')}</p>
    ) : (
      <Spinner className="mx-auto mt-16" />
    )
  }

  const product = selected
  const profile = profileOf(product)
  const localizedSds = sds.filter((doc) => doc.language === lang)
  const localizedWarnings = warnings.filter((warning) => warning.language === lang)
  const name = lang === 'ar' ? product.name_ar : product.name_en

  async function copySpecs() {
    const text = `${name} · ${product.sku} · ${product.brand} · CAS ${profile.casNumber} · pH ${profile.phBand} · ${profile.dilutionRatio}`
    try {
      await navigator.clipboard.writeText(text)
      toast(t('product.specsCopied'))
    } catch {
      toast(t('product.copyFailed'), 'danger')
    }
  }

  const severityTone = {
    info: 'aqua',
    warning: 'amber',
    danger: 'danger',
  } as const

  const safetyDots = Array.from({ length: 5 }, (_, index) => index < profile.safetyRating)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5">
      {/* Product window */}
      <div className="glass-strong float-2 overflow-hidden rounded-3xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                {t(profile.application)}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{name}</h1>
              <p className="mt-2 font-mono text-sm text-muted">
                {t('catalog.brand')}: {product.brand} · {t('catalog.unit')}: {product.unit} · {t('catalog.sku')}: {product.sku}
              </p>

              <p className="mt-5 leading-relaxed text-muted">
                {lang === 'ar' ? product.description_ar : product.description_en}
              </p>

              {/* Safety rating */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-sm font-medium text-muted">{t('badge.safety')}:</span>
                <div className="flex items-center gap-1">
                  {safetyDots.map((filled, index) => (
                    <span
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full ${filled ? 'bg-lime' : 'bg-ink/15'}`}
                    />
                  ))}
                  <span className="ms-1 text-sm font-bold text-ink">{profile.safetyRating}/5</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="aqua" icon={<FlaskIcon className="h-3 w-3" />}>
                  {t(`chemical.${profile.chemicalType}`)}
                </Badge>
                <Badge tone="neutral" icon={<DropletIcon className="h-3 w-3" />}>
                  {t('badge.ph')} {profile.phBand}
                </Badge>
                <Badge tone="neutral" icon={<DropletIcon className="h-3 w-3" />}>
                  {t('badge.dilution')} {profile.dilutionRatio}
                </Badge>
                {profile.ecoCertifications.map((eco) => (
                  <Badge key={eco} tone="lime" icon={<LeafIcon className="h-3 w-3" />}>
                    {t(`eco.${eco}`)}
                  </Badge>
                ))}
                <button
                  onClick={copySpecs}
                  className="pressable inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-surface/50 px-2.5 py-1 text-xs font-semibold text-muted hover:border-brand/40 hover:text-brand"
                >
                  <span className="font-mono">CAS {profile.casNumber}</span>
                  <CopyIcon className="h-3 w-3" />
                </button>
              </div>

              {/* Packaging */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted">{t('product.packaging')}:</span>
                {profile.packaging.map((size) => (
                  <Badge key={size} tone="neutral">
                    {size}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" onClick={copySpecs}>
                  <CopyIcon className="h-4 w-4" />
                  {t('product.copySpecs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dilution calculator */}
      <div className="mt-8">
        <DilutionCalculator profile={profile} />
      </div>

      {/* SDS */}
      <section className="mt-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <FileTextIcon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold text-ink">{t('product.sds')}</h2>
        </div>
        {localizedSds.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t('product.noSds')}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {localizedSds.map((doc) => (
              <li key={doc.id} className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {t('product.version')} {doc.version}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {t('product.issuedAt')}: {doc.issued_at}
                  </p>
                </div>
                <a
                  href={doc.file_url}
                  download
                  className="pressable inline-flex shrink-0 items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/20"
                >
                  <DownloadIcon className="h-4 w-4" />
                  {t('product.download')}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Warnings */}
      <section className="mt-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/15 text-amber">
            <WarningIcon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold text-ink">{t('product.warnings')}</h2>
        </div>
        {localizedWarnings.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t('product.noWarnings')}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {localizedWarnings.map((warning) => (
              <li key={warning.id} className="glass flex items-start gap-3 rounded-2xl px-4 py-3">
                <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-sm leading-relaxed text-ink">
                  <Badge tone={severityTone[warning.severity]} className="me-2 align-middle">
                    {t(`severity.${warning.severity}`)}
                  </Badge>
                  {warning.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
