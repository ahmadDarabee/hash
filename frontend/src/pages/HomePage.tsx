import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchCategories, fetchProducts } from '../features/catalog/catalogThunks'
import { useProductProfile } from '../features/catalog/useProductProfile'
import { Badge } from '../components/ui/Badge'
import { WindowChrome } from '../components/ui/WindowChrome'
import {
  ArrowRightIcon,
  DropletIcon,
  FlaskIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from '../components/icons'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, categories } = useAppSelector((state) => state.catalog)
  const profileOf = useProductProfile()
  const lang = i18n.language

  useEffect(() => {
    void dispatch(fetchCategories())
    void dispatch(fetchProducts({ page: 1, page_size: 8 }))
  }, [dispatch])

  const featured = products[0]
  const featuredName = featured ? (lang === 'ar' ? featured.name_ar : featured.name_en) : ''
  const featuredProfile = featured ? profileOf(featured) : null

  const categoryItems = categories.length
    ? categories
    : [
        { id: 1, slug: 'detergents', name_en: 'Detergents', name_ar: 'منظفات' },
        { id: 2, slug: 'sanitizers', name_en: 'Sanitizers', name_ar: 'معقمات' },
        { id: 3, slug: 'degreasers', name_en: 'Degreasers', name_ar: 'مزيلات الشحوم' },
        { id: 4, slug: 'soaps', name_en: 'Soaps', name_ar: 'صابون' },
      ]

  const categoryAccents = ['from-brand/20 to-brand/5', 'from-lime/20 to-lime/5', 'from-amber/20 to-amber/5', 'from-brand/20 to-lime/5']
  const categoryIcons = [SparklesIcon, ShieldCheckIcon, ZapIcon, DropletIcon]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-5 sm:pt-10">
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="animate-slide-up">
          <Badge tone="aqua" icon={<LeafIcon className="h-3 w-3" />}>
            {t('home.eyebrow')}
          </Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {t('home.title1')} <span className="text-gradient-aqua">{t('home.titleAccent')}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t('home.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="pressable inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-glow hover:brightness-110"
            >
              {t('home.browse')}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/quote"
              className="pressable glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-ink hover:shadow-float"
            >
              {t('nav.quote')}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheckIcon, label: t('home.sdsGuarantee') },
              { icon: LeafIcon, label: t('home.eco') },
              { icon: FlaskIcon, label: t('home.labTested') },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm font-medium text-muted">
                <Icon className="h-4 w-4 text-lime" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Mac-style product window */}
        <div className="animate-scale-in">
          <div className="glass-strong float-2 overflow-hidden rounded-2xl">
            <WindowChrome title="Hash — Product Inspector" />
            <div className="p-6">
              {featured ? (
                <Link to={`/products/${featured.id}`} className="group block">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {t('home.featured')}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-ink">{featuredName}</h3>
                  <p className="mt-1 font-mono text-sm text-muted">
                    {featured.brand} · {featured.sku}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredProfile && (
                      <>
                        <Badge tone="aqua" icon={<FlaskIcon className="h-3 w-3" />}>
                          pH {featuredProfile.phBand}
                        </Badge>
                        <Badge tone="neutral" icon={<DropletIcon className="h-3 w-3" />}>
                          {featuredProfile.dilutionRatio}
                        </Badge>
                        <Badge tone="lime" icon={<LeafIcon className="h-3 w-3" />}>
                          {featuredProfile.chemicalType}
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand">
                    {t('home.inspect')}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-3 text-muted">
                  <SparklesIcon className="h-8 w-8" />
                  <p className="text-sm">{t('common.loading')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Bento grid ------------------------------ */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t('home.bentoTitle')}</h2>
          <Link to="/products" className="pressable inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-aqua-strong">
            {t('home.viewAll')}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Categories — large */}
          <Link
            to="/products"
            className="glass hover-lift group relative col-span-1 overflow-hidden rounded-3xl p-5 sm:col-span-2 sm:row-span-2"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{t('home.categories')}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryItems.map((category, index) => {
                const Icon = categoryIcons[index % categoryIcons.length]
                return (
                  <div
                    key={category.id}
                    className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${categoryAccents[index % categoryAccents.length]} p-4 transition-transform duration-300 group-hover:scale-[1.02]`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 text-brand dark:bg-white/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {lang === 'ar' ? category.name_ar : category.name_en}
                    </span>
                  </div>
                )
              })}
            </div>
          </Link>

          {/* Compliance */}
          <Link
            to="/compliance"
            className="glass hover-lift group flex flex-col justify-between overflow-hidden rounded-3xl p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ShieldCheckIcon className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="font-semibold text-ink">{t('home.complianceCard')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t('home.complianceHint')}</p>
            </div>
          </Link>

          {/* Calculator teaser */}
          <Link
            to="/products"
            className="glass hover-lift group flex flex-col justify-between overflow-hidden rounded-3xl p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/15 text-lime">
              <DropletIcon className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="font-semibold text-ink">{t('home.calculatorCard')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t('home.calculatorHint')}</p>
            </div>
          </Link>

          {/* Eco stat */}
          <div className="glass flex flex-col justify-between overflow-hidden rounded-3xl p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/15 text-lime">
              <LeafIcon className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-ink">100%</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t('home.ecoStat')}</p>
            </div>
          </div>

          {/* Quote CTA banner */}
          <Link
            to="/quote"
            className="glass hover-lift group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand/15 to-lime/10 p-5 sm:col-span-2"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-brand dark:bg-white/10">
              <ZapIcon className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-ink">{t('home.quoteCta')}</h3>
              <p className="mt-1 text-sm text-muted">{t('home.quoteCtaHint')}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
