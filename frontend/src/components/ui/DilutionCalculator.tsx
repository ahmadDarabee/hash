import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  calculateDilution,
  INTENSITY_OPTIONS,
  SURFACE_OPTIONS,
} from '../../features/catalog/productProfile'
import type { Intensity, ProductProfile, SurfaceCode } from '../../features/catalog/productProfile'
import { Select } from './Select'
import { DropletIcon, GaugeIcon } from '../icons'

interface DilutionCalculatorProps {
  profile: ProductProfile
}

export function DilutionCalculator({ profile }: DilutionCalculatorProps) {
  const { t } = useTranslation()
  const [surface, setSurface] = useState<SurfaceCode>('floors')
  const [intensity, setIntensity] = useState<Intensity>('standard')
  const [waterLiters, setWaterLiters] = useState(10)

  const result = useMemo(
    () => calculateDilution(profile, surface, intensity, waterLiters),
    [profile, surface, intensity, waterLiters],
  )

  const surfaceLabels: Record<SurfaceCode, string> = {
    floors: t('surface.floors'),
    kitchen: t('surface.kitchen'),
    bathroom: t('surface.bathroom'),
    metal: t('surface.metal'),
    glass: t('surface.glass'),
    fabric: t('surface.fabric'),
    machinery: t('surface.machinery'),
    skin: t('surface.skin'),
  }

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <DropletIcon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold text-ink">{t('calculator.title')}</h3>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Select label={t('calculator.surface')} value={surface} onChange={(event) => setSurface(event.target.value as SurfaceCode)}>
          {SURFACE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {surfaceLabels[option]}
            </option>
          ))}
        </Select>
        <Select label={t('calculator.intensity')} value={intensity} onChange={(event) => setIntensity(event.target.value as Intensity)}>
          {INTENSITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`intensity.${option}`)}
            </option>
          ))}
        </Select>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="water-liters" className="text-sm font-medium text-ink">
            {t('calculator.waterLiters')}
          </label>
          <input
            id="water-liters"
            type="number"
            min={0.5}
            step={0.5}
            value={waterLiters}
            onChange={(event) => setWaterLiters(Math.max(0.5, Number(event.target.value) || 0.5))}
            className="glass rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-ink/5 p-4">
          <p className="text-xs font-medium text-muted">{t('calculator.ratio')}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-brand">{result.ratioLabel}</p>
        </div>
        <div className="rounded-2xl bg-ink/5 p-4">
          <p className="text-xs font-medium text-muted">{t('calculator.product')}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink">
            {result.productMl} <span className="text-sm font-semibold text-muted">ml</span>
          </p>
        </div>
        <div className="rounded-2xl bg-ink/5 p-4">
          <p className="text-xs font-medium text-muted">{t('calculator.water')}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-ink">
            {result.waterLiters} <span className="text-sm font-semibold text-muted">L</span>
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <GaugeIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
        {t('calculator.disclaimer')}
      </p>
    </div>
  )
}
