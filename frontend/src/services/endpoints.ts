import type {
  AuthResponse,
  Category,
  ChatReply,
  Paginated,
  Pricing,
  Product,
  QuotePayload,
  QuoteResponse,
  SdsDocument,
  SafetyWarning,
  User,
} from '../types'
import { api } from './api'

interface ProductParams {
  page?: number
  page_size?: number
  category_id?: number
  query?: string
  include_inactive?: boolean
}

export async function register(payload: {
  email: string
  password: string
  customer_type: 'b2c' | 'b2b'
  preferred_language: 'ar' | 'en'
  company_name?: string
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refresh_token: refreshToken })
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function getProducts(params: ProductParams = {}): Promise<Paginated<Product>> {
  const { data } = await api.get<Paginated<Product>>('/products', { params })
  return data
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}

export async function getProductSds(id: string): Promise<SdsDocument[]> {
  const { data } = await api.get<SdsDocument[]>(`/products/${id}/sds`)
  return data
}

export async function getProductWarnings(id: string): Promise<SafetyWarning[]> {
  const { data } = await api.get<SafetyWarning[]>(`/products/${id}/warnings`)
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories')
  return data
}

export async function getMyPricing(): Promise<Pricing | null> {
  const { data } = await api.get<Pricing | null>('/pricing/me')
  return data
}

export async function requestQuote(payload: QuotePayload): Promise<QuoteResponse> {
  const { data } = await api.post<QuoteResponse>('/quotes/request', payload)
  return data
}

export async function adminListProducts(params: ProductParams = {}): Promise<Paginated<Product>> {
  const { data } = await api.get<Paginated<Product>>('/admin/products', { params })
  return data
}

export async function adminCreateProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post<Product>('/admin/products', payload)
  return data
}

export async function adminUpdateProduct(id: string, changes: Partial<Product>): Promise<Product> {
  const { data } = await api.put<Product>(`/admin/products/${id}`, changes)
  return data
}

export async function adminUploadSds(form: FormData): Promise<SdsDocument> {
  const { data } = await api.post<SdsDocument>('/admin/sds', form)
  return data
}

export async function adminListUsers(params: { page?: number; page_size?: number } = {}): Promise<Paginated<User>> {
  const { data } = await api.get<Paginated<User>>('/admin/users', { params })
  return data
}

export async function adminAssignPricing(userId: string, priceListId: string): Promise<void> {
  await api.put(`/admin/users/${userId}/pricing`, { price_list_id: priceListId })
}

export async function wojakChat(message: string): Promise<ChatReply> {
  const { data } = await api.post<ChatReply>('/wojak/chat', { message })
  return data
}
