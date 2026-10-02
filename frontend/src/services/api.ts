import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

const ACCESS_KEY = 'hash.access'
const REFRESH_KEY = 'hash.refresh'

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown }
}

export const api = axios.create({ baseURL: BASE_URL })

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    return body?.error?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Unknown error'
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token available')

  const response = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refresh })
  const tokens = response.data.tokens
  setTokens(tokens.access_token, tokens.refresh_token)
  return tokens.access_token
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined
    const isAuthRoute = original?.url?.includes('/auth/')

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true
      try {
        refreshing = refreshing ?? refreshAccessToken()
        const access = await refreshing
        refreshing = null
        original.headers.Authorization = `Bearer ${access}`
        return api(original)
      } catch {
        refreshing = null
        clearTokens()
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)
