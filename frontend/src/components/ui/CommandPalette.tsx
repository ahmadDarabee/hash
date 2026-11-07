import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'
import type { Category, Product } from '../../types'
import { getProductProfile, resolveCategorySlug } from '../../features/catalog/productProfile'
import { Badge } from './Badge'
import {
  CommandIcon,
  SearchIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  LayersIcon,
  SparklesIcon,
} from '../icons'

interface PaletteContextValue {
  open: () => void
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

interface ResultItem {
  id: string
  group: 'products' | 'categories' | 'actions'
  label: string
  sublabel: string
  to: string
  product?: Product
  rating?: number
  _haystack?: string
}

function CommandPaletteModal({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { products, categories } = useAppSelector((state) => state.catalog)

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const lang = i18n.language

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase()

    const actionItems: ResultItem[] = [
      { id: 'action-home', group: 'actions', label: t('nav.home'), sublabel: '/', to: '/' },
      { id: 'action-products', group: 'actions', label: t('nav.products'), sublabel: '/products', to: '/products' },
      { id: 'action-compliance', group: 'actions', label: t('nav.compliance'), sublabel: '/compliance', to: '/compliance' },
    ]

    const productItems: ResultItem[] = products.map((product) => {
      const slug = resolveCategorySlug(product.category_id, categories)
      const profile = getProductProfile(product, slug)
      const name = lang === 'ar' ? product.name_ar : product.name_en
      const haystack = [
        product.name_en,
        product.name_ar,
        product.brand,
        product.sku,
        profile.casNumber,
        profile.chemicalType,
        profile.phBand,
        profile.dilutionRatio,
        profile.application,
        `rating ${profile.safetyRating}`,
      ]
        .join(' ')
        .toLowerCase()
      return {
        id: `product-${product.id}`,
        group: 'products' as const,
        label: name,
        sublabel: `${product.brand} · ${product.sku} · CAS ${profile.casNumber}`,
        to: `/products/${product.id}`,
        product,
        rating: profile.safetyRating,
        _haystack: haystack,
      }
    })

    const categoryItems: ResultItem[] = categories.map((category) => ({
      id: `category-${category.id}`,
      group: 'categories' as const,
      label: lang === 'ar' ? category.name_ar : category.name_en,
      sublabel: category.slug,
      to: '/products',
    }))

    const filter = (items: ResultItem[]) =>
      q
        ? items.filter((item) => {
            const hay = item._haystack ?? `${item.label} ${item.sublabel}`.toLowerCase()
            return hay.includes(q)
          })
        : items

    if (!q) {
      // Default: actions + categories + a few products.
      return [...filter(actionItems), ...filter(categoryItems), ...filter(productItems).slice(0, 6)]
    }

    return [...filter(productItems), ...filter(categoryItems), ...filter(actionItems)]
  }, [query, products, categories, lang, t])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function activate(item: ResultItem) {
    navigate(item.to)
    onClose()
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((prev) => (results.length ? (prev + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[active]
      if (item) activate(item)
    } else if (event.key === 'Escape') {
      onClose()
    }
  }

  const groupLabels: Record<ResultItem['group'], string> = {
    products: t('palette.products'),
    categories: t('palette.categories'),
    actions: t('palette.actions'),
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
      />
      <div className="glass-strong relative w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl shadow-float-lg">
        <div className="flex items-center gap-3 border-b border-line/70 px-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('palette.placeholder')}
            className="w-full bg-transparent py-4 text-base text-ink placeholder:text-muted/70 focus:outline-none"
          />
          <kbd className="rounded-md border border-line bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-muted">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <SparklesIcon className="h-6 w-6 text-muted" />
              <p className="text-sm text-muted">{t('palette.empty')}</p>
            </div>
          ) : (
            results.map((item, index) => {
              const showGroup =
                index === 0 || results[index - 1].group !== item.group
              return (
                <div key={item.id}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {groupLabels[item.group]}
                    </p>
                  )}
                  <button
                    data-index={index}
                    onClick={() => activate(item)}
                    onMouseEnter={() => setActive(index)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition ${
                      active === index ? 'bg-brand/10' : 'hover:bg-ink/5'
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-brand">
                      {item.group === 'products' ? (
                        <LayersIcon className="h-4 w-4" />
                      ) : item.group === 'categories' ? (
                        <CommandIcon className="h-4 w-4" />
                      ) : (
                        <ArrowRightIcon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{item.label}</span>
                      <span className="block truncate font-mono text-xs text-muted">{item.sublabel}</span>
                    </span>
                    {item.rating !== undefined && (
                      <Badge tone="aqua" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                        {item.rating}/5
                      </Badge>
                    )}
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line/70 px-4 py-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-ink/5 px-1.5 py-0.5 font-mono">↑↓</kbd> {t('palette.navigate')}
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-ink/5 px-1.5 py-0.5 font-mono">↵</kbd> {t('palette.open')}
          </span>
        </div>
      </div>
    </div>
  )
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const value = useMemo(() => ({ open }), [open])

  return (
    <PaletteContext.Provider value={value}>
      {children}
      {isOpen && <CommandPaletteModal onClose={close} />}
    </PaletteContext.Provider>
  )
}

export function useCommandPalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext)
  if (!ctx) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider')
  }
  return ctx
}
