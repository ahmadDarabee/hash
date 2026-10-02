import { createSlice } from '@reduxjs/toolkit'

import type { Product, User } from '../../types'
import {
  adminAssignPricing,
  adminCreateProduct,
  adminListProducts,
  adminListUsers,
  adminUpdateProduct,
  adminUploadSds,
} from './adminThunks'

interface AdminState {
  products: Product[]
  users: User[]
  total: number
  page: number
  pageSize: number
  status: 'idle' | 'loading' | 'succeeded' | 'error'
  error: string | null
}

const initialState: AdminState = {
  products: [],
  users: [],
  total: 0,
  page: 1,
  pageSize: 20,
  status: 'idle',
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminListProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(adminListProducts.fulfilled, (state, action) => {
        state.products = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.page_size
        state.status = 'succeeded'
      })
      .addCase(adminListProducts.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'failed to load products'
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) state.products[index] = action.payload
      })
      .addCase(adminListUsers.fulfilled, (state, action) => {
        state.users = action.payload.items
      })
      .addCase(adminListUsers.rejected, (state, action) => {
        state.error = action.payload ?? 'failed to load users'
      })
      .addCase(adminUploadSds.fulfilled, () => undefined)
      .addCase(adminAssignPricing.fulfilled, () => undefined)
  },
})

export default adminSlice.reducer
