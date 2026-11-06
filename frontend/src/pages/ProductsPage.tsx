import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { WindowChrome } from '../components/ui/WindowChrome'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../components/ui/Toast'
import { addItem } from '../features/cart/cartSlice'
import { fetchCategories, fetchProducts } from '../features/catalog/catalogThunks'
import { useProductProfile } from '../features/catalog/useProductProfile'
import {
  CHEMICAL_TYPES,
  PACKAGING_OPTIONS,
  SURFACE_OPTIONS,
} from '../features/catalog/productProfile'
import type { ChemicalType, SurfaceCode } from '../features/catalog/productProfile'
import {
  CheckIcon,
  CloseIcon,
  CommandIcon,
  DropletIcon,
  FlaskIcon,
  LeafIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersIcon,
} from '../components/icons'

interface PillTagProps {
  label: string
  selected: boolean
  onClick: () => void
}

function PillTag({ label, selected, onClick }: PillTagProps) {
  return (
    <button
      onClick={onClick}
      className={`pressable inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        selected
          ? 'border-brand/40 bg-brand/15 text-brand glow-active'
          : 'border-line/70 bg-surface/50 text-muted hover:border-brand/30 hover:text-ink'
      }`}
    >
      {selected && <CheckIcon className="h-3 w-3" />}
      {label}
    </button>
  )
}

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, categories, status } = useAppSelector((state) => state.catalog)
  const profileOf = useProductProfile()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [chemicalTypes, setChemicalTypes] = useState<ChemicalType[]>([])
  const [surfaces, setSurfaces] = useState<SurfaceCode[]>([])
  const [packaging, setPackaging] = useState<string[]>([])

  const lang = i18n.language

  useEffect(() => {
    void dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    void dispatch(
      fetchProducts({
        category_id: categoryId,
        query: debouncedQuery || undefined,
        page: 1,
        page_size: 100,
      }),
    )
  }, [dispatch, categoryId, debouncedQuery])

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
  }

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const profile = profileOf(product)
      if (chemicalTypes.length && !chemicalTypes.includes(profile.chemicalType)) return false
      if (surfaces.length && !surfaces.some((surface) => profile.surfaces.includes(surface))) return false
      if (packaging.length && !packaging.some((size) => profile.packaging.includes(size))) return false
      return true
    })
  }, [products, chemicalTypes, surfaces, packaging, profileOf])

  const activeFilterCount = chemicalTypes.length + surfaces.length + packaging.length + (categoryId ? 1 : 0)

  function clearFilters() {
    setChemicalTypes([])
    setSurfaces([])
    setPackaging([])
    setCategoryId(undefined)
  }

  function addToQuote(product: (typeof products)[number]) {
    dispatch(addItem(product))
    toast(t('cart.added'))
  }

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t('catalog.title')}</h1>
          <p className="mt-1 text-muted">{t('catalog.subtitle')}</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="pressable glass inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-semibold text-ink hover:shadow-float"
        >
          <SlidersIcon className="h-4 w-4 text-brand" />
          {t('filters.title')}
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('catalog.searchPlaceholder')}
          className="glass-strong w-full rounded-2xl py-3.5 pe-28 ps-12 text-base text-ink placeholder:text-muted/70 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
        <kbd className="absolute end-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-line bg-ink/5 px-2 py-1 font-mono text-[10px] text-muted sm:flex">
          <CommandIcon className="h-3 w-3" /> K
        </kbd>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={clearFilters} className="pressable text-xs font-semibold text-danger hover:underline">
            {t('filters.clear')}
          </button>
        </div>
      )}

      {/* Content */}
      {status === 'loading' ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass mt-6 flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-muted">
            <SearchIcon className="h-7 w-7" />
          </span>
          <p className="text-muted">{t('catalog.noProducts')}</p>
          {activeFilterCount > 0 && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              {t('filters.clear')}
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const profile = profileOf(product)
            const name = lang === 'ar' ? product.name_ar : product.name_en
            return (
              <div key={product.id} className="glass hover-lift group flex flex-col overflow-hidden rounded-2xl">
                <WindowChrome title={product.sku} className="opacity-70" />
                <div className="flex flex-1 flex-col p-5">
                  <Link to={`/products/${product.id}`} className="block">
                    <h2 className="text-base font-bold text-ink transition-colors group-hover:text-brand">
                      {name}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {product.brand} · {product.unit}
                    </p>
                  </Link>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge tone="aqua" icon={<FlaskIcon className="h-3 w-3" />}>
                      {t(`chemical.${profile.chemicalType}`)}
                    </Badge>
                    <Badge tone="neutral" icon={<DropletIcon className="h-3 w-3" />}>
                      {t('badge.ph')} {profile.phBand}
                    </Badge>
                    <Badge tone="lime" icon={<LeafIcon className="h-3 w-3" />}>
                      {profile.ecoCertifications.length > 0 ? t(`eco.${profile.ecoCertifications[0]}`) : t('badge.eco')}
                    </Badge>
                    <Badge tone="amber" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                      {t('badge.safety')} {profile.safetyRating}/5
                    </Badge>
                  </div>

                  <div className="mt-5 flex items-center gap-2 pt-1">
                    <Button variant="secondary" size="sm" onClick={() => addToQuote(product)}>
                      <PlusIcon className="h-3.5 w-3.5" />
                      {t('catalog.addToQuote')}
                    </Button>
                    <Link
                      to={`/products/${product.id}`}
                      className="pressable ms-auto inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-aqua-strong"
                    >
                      {t('catalog.viewDetails')}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setDrawerOpen(false)} className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm" />
          <aside className="glass-strong animate-slide-in-end absolute inset-y-0 end-0 flex w-full max-w-sm flex-col rounded-s-2xl shadow-float-lg">
            <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
              <h2 className="text-lg font-bold text-ink">{t('filters.title')}</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="pressable flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                aria-label={t('common.close')}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto p-5">
              {/* Category */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{t('filters.category')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PillTag
                    label={t('catalog.allCategories')}
                    selected={categoryId === undefined}
                    onClick={() => setCategoryId(undefined)}
                  />
                  {categories.map((category) => (
                    <PillTag
                      key={category.id}
                      label={lang === 'ar' ? category.name_ar : category.name_en}
                      selected={categoryId === category.id}
                      onClick={() => setCategoryId(categoryId === category.id ? undefined : category.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Chemical type */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{t('filters.chemicalType')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHEMICAL_TYPES.map((type) => (
                    <PillTag
                      key={type}
                      label={t(`chemical.${type}`)}
                      selected={chemicalTypes.includes(type)}
                      onClick={() => setChemicalTypes((prev) => toggle(prev, type))}
                    />
                  ))}
                </div>
              </div>

              {/* Surface application */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{t('filters.surface')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SURFACE_OPTIONS.map((surface) => (
                    <PillTag
                      key={surface}
                      label={surfaceLabels[surface]}
                      selected={surfaces.includes(surface)}
                      onClick={() => setSurfaces((prev) => toggle(prev, surface))}
                    />
                  ))}
                </div>
              </div>

              {/* Packaging size */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{t('filters.packaging')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PACKAGING_OPTIONS.map((size) => (
                    <PillTag
                      key={size}
                      label={size}
                      selected={packaging.includes(size)}
                      onClick={() => setPackaging((prev) => toggle(prev, size))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-line/70 p-4">
              <Button variant="secondary" className="flex-1" onClick={clearFilters}>
                {t('filters.clear')}
              </Button>
              <Button className="flex-1" onClick={() => setDrawerOpen(false)}>
                {t('filters.apply')}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
