import { configureStore } from '@reduxjs/toolkit'

import adminReducer from '../features/admin/adminSlice'
import authReducer from '../features/auth/authSlice'
import catalogReducer from '../features/catalog/catalogSlice'
import i18nReducer from '../features/i18n/i18nSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    admin: adminReducer,
    i18n: i18nReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
