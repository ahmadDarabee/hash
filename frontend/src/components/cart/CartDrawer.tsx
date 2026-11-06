import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useProductProfile } from '../../features/catalog/useProductProfile'
import { removeItem, setQty } from '../../features/cart/cartSlice'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { CloseIcon, CopyIcon, MinusIcon, PlusIcon, QuoteIcon, TrashIcon, ShieldCheckIcon } from '../icons'

interface CartDrawerContextValue {
  open: () => void
  close: () => void
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

function CartDrawerPanel({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)
  const profileOf = useProductProfile()
  const { toast } = useToast()
  const lang = i18n.language

  async function copySpecs(name: string, sku: string, brand: string, cas: string) {
    const text = `${name} · ${sku} · ${brand} · CAS ${cas}`
    try {
      await navigator.clipboard.writeText(text)
      toast(t('cart.copied'))
    } catch {
      toast(t('cart.copyFailed'), 'danger')
    }
  }

  function goToQuote() {
    onClose()
    navigate('/quote')
  }

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm" />
      <aside className="glass-strong animate-slide-in-end absolute inset-y-0 end-0 flex w-full max-w-md flex-col rounded-s-2xl shadow-float-lg">
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">{t('cart.title')}</h2>
            <p className="text-xs text-muted">
              {items.length} {t('cart.itemsCount')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="pressable flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
            aria-label={t('common.close')}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-muted">
                <QuoteIcon className="h-7 w-7" />
              </span>
              <p className="text-sm text-muted">{t('cart.empty')}</p>
              <Button variant="secondary" size="sm" onClick={() => { onClose(); navigate('/products') }}>
                {t('cart.browse')}
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, qty }) => {
                const name = lang === 'ar' ? product.name_ar : product.name_en
                const profile = profileOf(product)
                return (
                  <li key={product.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{name}</p>
                        <p className="mt-0.5 truncate font-mono text-xs text-muted">
                          {product.sku} · {product.brand}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(removeItem(product.id))}
                        className="pressable flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                        aria-label={t('cart.remove')}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge tone="aqua" icon={<ShieldCheckIcon className="h-3 w-3" />}>
                        {t('badge.ph')} {profile.phBand}
                      </Badge>
                      <Badge tone="neutral">{t('badge.dilution')} {profile.dilutionRatio}</Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="glass flex items-center gap-1 rounded-full p-1">
                        <button
                          onClick={() => dispatch(setQty({ id: product.id, qty: qty - 1 }))}
                          className="pressable flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                          aria-label={t('cart.decrease')}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
                        <button
                          onClick={() => dispatch(setQty({ id: product.id, qty: qty + 1 }))}
                          className="pressable flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                          aria-label={t('cart.increase')}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => copySpecs(name, product.sku, product.brand, profile.casNumber)}
                        className="pressable flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:bg-brand/10 hover:text-brand"
                      >
                        <CopyIcon className="h-3.5 w-3.5" />
                        {t('cart.copySpecs')}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line/70 p-4">
            <Button className="w-full" size="lg" onClick={goToQuote}>
              <QuoteIcon className="h-4 w-4" />
              {t('cart.requestQuote')}
            </Button>
          </div>
        )}
      </aside>
    </div>
  )
}

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      {isOpen && <CartDrawerPanel onClose={close} />}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer(): CartDrawerContextValue {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) {
    throw new Error('useCartDrawer must be used within a CartDrawerProvider')
  }
  return ctx
}
