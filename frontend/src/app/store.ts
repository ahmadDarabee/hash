import { configureStore } from '@reduxjs/toolkit'

import adminReducer from '../features/admin/adminSlice'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import catalogReducer from '../features/catalog/catalogSlice'
import i18nReducer from '../features/i18n/i18nSlice'
import { wojakBus } from '../features/wojak/wojakBus'
import wojakReducer from '../features/wojak/wojakSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    cart: cartReducer,
    admin: adminReducer,
    i18n: i18nReducer,
    wojak: wojakReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wojakBus),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
