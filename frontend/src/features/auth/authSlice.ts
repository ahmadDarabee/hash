import { createSlice } from '@reduxjs/toolkit'

import type { User } from '../../types'
import { fetchMe, login, logout, register } from './authThunks'

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.status = 'authenticated'
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload ?? 'login failed'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.status = 'authenticated'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = action.payload ?? 'register failed'
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.status = 'unauthenticated'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'unauthenticated'
      })
  },
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer
