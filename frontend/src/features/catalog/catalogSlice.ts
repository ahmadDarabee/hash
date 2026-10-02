import { createSlice } from '@reduxjs/toolkit'

import type { Category, Product, SdsDocument, SafetyWarning } from '../../types'
import {
  fetchCategories,
  fetchProduct,
  fetchProducts,
  fetchProductSds,
  fetchProductWarnings,
} from './catalogThunks'

interface CatalogState {
  products: Product[]
  categories: Category[]
  selected: Product | null
  sds: SdsDocument[]
  warnings: SafetyWarning[]
  total: number
  page: number
  pageSize: number
  status: 'idle' | 'loading' | 'succeeded' | 'error'
  error: string | null
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  selected: null,
  sds: [],
  warnings: [],
  total: 0,
  page: 1,
  pageSize: 20,
  status: 'idle',
  error: null,
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.page_size
        state.status = 'succeeded'
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'failed to load products'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchProduct.pending, (state) => {
        state.selected = null
        state.sds = []
        state.warnings = []
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selected = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.payload ?? 'product not found'
        state.status = 'error'
      })
      .addCase(fetchProductSds.fulfilled, (state, action) => {
        state.sds = action.payload
      })
      .addCase(fetchProductWarnings.fulfilled, (state, action) => {
        state.warnings = action.payload
      })
  },
})

export default catalogSlice.reducer
