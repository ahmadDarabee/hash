// Shared API types. Money fields arrive as strings (Decimal serialized by Pydantic).

export type Language = 'ar' | 'en'

export type Role = 'admin' | 'customer_b2b' | 'customer_b2c'
export type CustomerType = 'b2c' | 'b2b'

export interface User {
  id: string
  email: string
  role: Role
  customer_type: CustomerType
  preferred_language: Language
  company_name: string | null
  is_active: boolean
  created_at: string | null
}

export interface Category {
  id: number
  slug: string
  name_en: string
  name_ar: string
  parent_id: number | null
}

export interface Product {
  id: string
  sku: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  category_id: number
  brand: string
  unit: string
  kind: 'raw' | 'finished'
  is_active: boolean
}

export interface SdsDocument {
  id: string
  product_id: string
  language: Language
  version: string
  file_url: string
  issued_at: string
  revision_notes: string | null
}

export interface SafetyWarning {
  id: string
  product_id: string
  language: Language
  severity: 'info' | 'warning' | 'danger'
  text: string
}

export interface PriceListItem {
  product_id: string
  price: string
  currency: string
  min_qty: string
  discount_pct: string
}

export interface Pricing {
  price_list_id: string
  name: string
  is_default: boolean
  items: PriceListItem[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthResponse {
  user: User
  tokens: TokenPair
}

export interface QuotePayload {
  contact_name: string
  contact_email: string
  contact_phone?: string
  company_name?: string
  notes?: string
}

export interface QuoteResponse {
  id: string
  contact_name: string
  contact_email: string
  status: string
  created_at: string | null
}

export interface ChatReply {
  intent: string
  state: string
}
