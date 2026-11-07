import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ProductMedia } from '../../types'
import { CloseIcon, ImageIcon, PlayIcon } from '../icons'

interface MediaGalleryProps {
  media: ProductMedia[]
}

/**
 * Renders product photos and videos. Returns null when there is no media,
 * so callers can mount it unconditionally ("display if they exist").
 */
export function MediaGallery({ media }: MediaGalleryProps) {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (media.length === 0) return null

  const images = media.filter((item) => item.kind === 'image')
  const videos = media.filter((item) => item.kind === 'video')

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <ImageIcon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-bold text-ink">{t('product.media')}</h2>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(index)}
            className="glass group overflow-hidden rounded-2xl text-start"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
              <img
                src={item.url}
                alt={item.title ?? t('product.photo')}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <ImageFallback />
            </div>
            {item.title && (
              <p className="truncate px-3 py-2 text-xs font-medium text-muted">{item.title}</p>
            )}
          </button>
        ))}

        {videos.map((item) => (
          <div key={item.id} className="glass overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/90">
              <video
                src={item.url}
                controls
                preload="metadata"
                playsInline
                className="h-full w-full object-contain"
              />
              <span className="pointer-events-none absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
                <PlayIcon className="h-3 w-3" />
                {t('product.video')}
              </span>
            </div>
            {item.title && (
              <p className="truncate px-3 py-2 text-xs font-medium text-muted">{item.title}</p>
            )}
          </div>
        ))}
      </div>

      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="pressable absolute end-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t('common.close')}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <figure className="max-h-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={images[lightbox].url}
              alt={images[lightbox].title ?? t('product.photo')}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            {images[lightbox].title && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {images[lightbox].title}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  )
}

function ImageFallback() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted">
      <ImageIcon className="h-8 w-8" />
    </span>
  )
}
