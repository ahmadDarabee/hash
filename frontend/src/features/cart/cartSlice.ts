import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Product } from '../../types'

export interface CartItem {
  product: Product
  qty: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const existing = state.items.find((item) => item.product.id === action.payload.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ product: action.payload, qty: 1 })
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find((entry) => entry.product.id === action.payload.id)
      if (item) {
        item.qty = Math.max(1, action.payload.qty)
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, removeItem, setQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
