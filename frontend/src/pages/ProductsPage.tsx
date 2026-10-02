import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Spinner } from '../components/ui/Spinner'
import { addItem } from '../features/cart/cartSlice'
import { fetchCategories, fetchProducts } from '../features/catalog/catalogThunks'

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, categories, status } = useAppSelector((state) => state.catalog)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()

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
        page_size: 50,
      }),
    )
  }, [dispatch, categoryId, debouncedQuery])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t('catalog.title')}</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={t('catalog.searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:w-72"
        />
        <select
          value={categoryId ?? ''}
          onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : undefined)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">{t('catalog.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {lang === 'ar' ? category.name_ar : category.name_en}
            </option>
          ))}
        </select>
      </div>

      {status === 'loading' && <Spinner className="mt-8" />}
      {status === 'succeeded' && products.length === 0 && (
        <p className="mt-8 text-gray-500">{t('catalog.noProducts')}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <h2 className="font-semibold">{lang === 'ar' ? product.name_ar : product.name_en}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {product.brand} · {product.unit} · {product.sku}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/products/${product.id}`}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                {t('catalog.viewDetails')}
              </Link>
              <Button onClick={() => dispatch(addItem(product))}>{t('catalog.addToCart')}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
