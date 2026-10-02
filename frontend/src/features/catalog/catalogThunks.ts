import { createAsyncThunk } from '@reduxjs/toolkit'

import { getErrorMessage } from '../../services/api'
import * as endpoints from '../../services/endpoints'
import type { Category, Paginated, Product, SdsDocument, SafetyWarning } from '../../types'

interface ProductParams {
  page?: number
  page_size?: number
  category_id?: number
  query?: string
}

export const fetchProducts = createAsyncThunk<
  Paginated<Product>,
  ProductParams,
  { rejectValue: string }
>('catalog/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    return await endpoints.getProducts(params)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'catalog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await endpoints.getCategories()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchProduct = createAsyncThunk<Product, string, { rejectValue: string }>(
  'catalog/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await endpoints.getProduct(id)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchProductSds = createAsyncThunk<SdsDocument[], string, { rejectValue: string }>(
  'catalog/fetchProductSds',
  async (id, { rejectWithValue }) => {
    try {
      return await endpoints.getProductSds(id)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchProductWarnings = createAsyncThunk<
  SafetyWarning[],
  string,
  { rejectValue: string }
>('catalog/fetchProductWarnings', async (id, { rejectWithValue }) => {
  try {
    return await endpoints.getProductWarnings(id)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})
