import { createAsyncThunk } from '@reduxjs/toolkit'

import { getErrorMessage } from '../../services/api'
import * as endpoints from '../../services/endpoints'
import type { Paginated, Product, SdsDocument, User } from '../../types'

interface ListParams {
  page?: number
  page_size?: number
  query?: string
}

export const adminListProducts = createAsyncThunk<
  Paginated<Product>,
  ListParams,
  { rejectValue: string }
>('admin/listProducts', async (params, { rejectWithValue }) => {
  try {
    return await endpoints.adminListProducts(params)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const adminCreateProduct = createAsyncThunk<Product, Partial<Product>, { rejectValue: string }>(
  'admin/createProduct',
  async (payload, { rejectWithValue }) => {
    try {
      return await endpoints.adminCreateProduct(payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const adminUpdateProduct = createAsyncThunk<
  Product,
  { id: string; changes: Partial<Product> },
  { rejectValue: string }
>('admin/updateProduct', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await endpoints.adminUpdateProduct(id, changes)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const adminUploadSds = createAsyncThunk<SdsDocument, FormData, { rejectValue: string }>(
  'admin/uploadSds',
  async (form, { rejectWithValue }) => {
    try {
      return await endpoints.adminUploadSds(form)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const adminListUsers = createAsyncThunk<
  Paginated<User>,
  ListParams,
  { rejectValue: string }
>('admin/listUsers', async (params, { rejectWithValue }) => {
  try {
    return await endpoints.adminListUsers(params)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const adminAssignPricing = createAsyncThunk<
  void,
  { userId: string; priceListId: string },
  { rejectValue: string }
>('admin/assignPricing', async ({ userId, priceListId }, { rejectWithValue }) => {
  try {
    return await endpoints.adminAssignPricing(userId, priceListId)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})
