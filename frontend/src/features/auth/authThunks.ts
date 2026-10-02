import { createAsyncThunk } from '@reduxjs/toolkit'

import { clearTokens, getErrorMessage, getRefreshToken, setTokens } from '../../services/api'
import * as endpoints from '../../services/endpoints'
import type { AuthResponse, User } from '../../types'

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await endpoints.login(payload.email, payload.password)
    setTokens(res.tokens.access_token, res.tokens.refresh_token)
    return res
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

interface RegisterPayload {
  email: string
  password: string
  customer_type: 'b2c' | 'b2b'
  preferred_language: 'ar' | 'en'
  company_name?: string
}

export const register = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await endpoints.register(payload)
      setTokens(res.tokens.access_token, res.tokens.refresh_token)
      return res
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await endpoints.getMe()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
  const refresh = getRefreshToken()
  try {
    if (refresh) await endpoints.logout(refresh)
  } catch {
    // Best-effort: clear local tokens even if the server call fails.
  } finally {
    clearTokens()
  }
})
