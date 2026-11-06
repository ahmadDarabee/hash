import { useCallback } from 'react'

import { useAppSelector } from '../../app/hooks'
import type { Product } from '../../types'
import { getProductProfile, resolveCategorySlug } from './productProfile'
import type { ProductProfile } from './productProfile'

/** Resolve a product's derived chemical profile using loaded categories. */
export function useProductProfile() {
  const categories = useAppSelector((state) => state.catalog.categories)

  return useCallback(
    (product: Product): ProductProfile => {
      const slug = resolveCategorySlug(product.category_id, categories)
      return getProductProfile(product, slug)
    },
    [categories],
  )
}
