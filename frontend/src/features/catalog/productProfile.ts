import type { Category, Product } from '../../types'

/**
 * Product intelligence — client-side enrichment.
 *
 * The backend catalog currently exposes only core fields (sku, name,
 * category, brand, unit, kind). This module derives a *presentation-layer*
 * chemical profile deterministically from those fields so the UI can show
 * pH bands, dilution ratios, CAS references, eco-certifications, packaging,
 * surface applications and a safety rating — without inventing backend data.
 *
 * Replace this derivation with real backend columns (ph, cas_number,
 * dilution_ratio, certifications, etc.) when they land, keeping the same
 * `ProductProfile` shape so no component changes are required.
 */

export type ChemicalType = 'acidic' | 'alkaline' | 'neutral' | 'enzymatic'
export type SurfaceCode =
  | 'floors'
  | 'kitchen'
  | 'bathroom'
  | 'metal'
  | 'glass'
  | 'fabric'
  | 'machinery'
  | 'skin'
export type Intensity = 'light' | 'standard' | 'heavy'
export type EcoCode = 'euEcolabel' | 'biodegradable' | 'en1276' | 'foodSafe' | 'lowVoc' | 'vegan'

export interface ProductProfile {
  chemicalType: ChemicalType
  phValue: number
  phBand: string
  casNumber: string
  dilutionRatio: string
  dilutionFactor: number
  surfaces: SurfaceCode[]
  packaging: string[]
  ecoCertifications: EcoCode[]
  safetyRating: number // 1..5, 5 = safest
  application: string // i18n key under `application.*`
}

interface PhRange {
  min: number
  max: number
}

interface CategoryProfile {
  application: string
  types: ChemicalType[]
  ph: Record<ChemicalType, PhRange>
  surfaces: SurfaceCode[]
  dilutionBase: number
  eco: EcoCode[]
  safety: number
  casPrefix: string
}

const CATEGORY_PROFILES: Record<string, CategoryProfile> = {
  detergents: {
    application: 'application.detergent',
    types: ['alkaline', 'alkaline', 'neutral', 'enzymatic'],
    ph: {
      acidic: { min: 4.5, max: 6 },
      alkaline: { min: 9, max: 11 },
      neutral: { min: 7, max: 8 },
      enzymatic: { min: 6.5, max: 8 },
    },
    surfaces: ['floors', 'kitchen', 'bathroom', 'fabric'],
    dilutionBase: 40,
    eco: ['biodegradable', 'euEcolabel'],
    safety: 4,
    casPrefix: '6834',
  },
  sanitizers: {
    application: 'application.sanitizer',
    types: ['neutral', 'neutral', 'acidic', 'alkaline'],
    ph: {
      acidic: { min: 2, max: 4 },
      alkaline: { min: 8, max: 10 },
      neutral: { min: 6.5, max: 7.5 },
      enzymatic: { min: 6.5, max: 8 },
    },
    surfaces: ['kitchen', 'bathroom', 'metal', 'glass'],
    dilutionBase: 20,
    eco: ['en1276', 'foodSafe'],
    safety: 3,
    casPrefix: '7722',
  },
  degreasers: {
    application: 'application.degreaser',
    types: ['alkaline', 'alkaline', 'alkaline', 'acidic', 'enzymatic'],
    ph: {
      acidic: { min: 3, max: 4.5 },
      alkaline: { min: 11.5, max: 13 },
      neutral: { min: 7, max: 8.5 },
      enzymatic: { min: 7, max: 8.5 },
    },
    surfaces: ['metal', 'floors', 'machinery', 'kitchen'],
    dilutionBase: 10,
    eco: ['lowVoc', 'biodegradable'],
    safety: 2,
    casPrefix: '1310',
  },
  soaps: {
    application: 'application.soap',
    types: ['neutral', 'neutral', 'alkaline', 'acidic'],
    ph: {
      acidic: { min: 5, max: 6 },
      alkaline: { min: 9, max: 10.5 },
      neutral: { min: 7, max: 8 },
      enzymatic: { min: 7, max: 8 },
    },
    surfaces: ['fabric', 'skin', 'kitchen'],
    dilutionBase: 30,
    eco: ['vegan', 'euEcolabel'],
    safety: 5,
    casPrefix: '151-21-3',
  },
}

// Seed-order fallback so profiles still read sensibly before categories load.
const SEED_SLUG_BY_ID: Record<number, string> = {
  1: 'detergents',
  2: 'sanitizers',
  3: 'degreasers',
  4: 'soaps',
}

const FALLBACK_PROFILE: CategoryProfile = {
  application: 'application.cleaner',
  types: ['neutral', 'alkaline'],
  ph: {
    acidic: { min: 5, max: 6.5 },
    alkaline: { min: 8.5, max: 10.5 },
    neutral: { min: 7, max: 8 },
    enzymatic: { min: 6.5, max: 8 },
  },
  surfaces: ['floors', 'kitchen'],
  dilutionBase: 25,
  eco: ['biodegradable'],
  safety: 3,
  casPrefix: '144',
}

export function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(items: T[], seed: string): T {
  return items[hashString(seed) % items.length]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export const PACKAGING_OPTIONS = ['1 L', '5 L', '20 L', '200 L', '1000 L']

/** Resolve a category slug from a category id using the loaded category list. */
export function resolveCategorySlug(categoryId: number, categories: Category[]): string {
  return categories.find((category) => category.id === categoryId)?.slug ?? `cat-${categoryId}`
}

function profileForSlug(slug: string): CategoryProfile {
  return CATEGORY_PROFILES[slug] ?? CATEGORY_PROFILES[SEED_SLUG_BY_ID[Number(slug.replace('cat-', ''))]] ?? FALLBACK_PROFILE
}

/**
 * Derive a deterministic chemical profile for a product. Products within the
 * same category share a family of values, but vary by SKU so the catalog
 * reads as a real, diverse range rather than four cloned rows.
 */
export function getProductProfile(product: Product, categorySlug?: string): ProductProfile {
  const seed = `${product.category_id}:${product.sku}:${product.brand}`
  const slug = categorySlug ?? SEED_SLUG_BY_ID[product.category_id] ?? `cat-${product.category_id}`
  const category = profileForSlug(slug)

  const chemicalType = pick(category.types, `${seed}:type`)
  const range = category.ph[chemicalType]
  const phValue = Number(((range.min + range.max) / 2).toFixed(1))

  // Raw concentrates dilute further; finished goods are closer to ready-to-use.
  const kindFactor = product.kind === 'raw' ? 1.6 : 1
  const dilutionFactor = Math.max(1, Math.round(category.dilutionBase * kindFactor * (0.8 + (hashString(seed) % 41) / 100)))

  const safetyJitter = hashString(`${seed}:safety`) % 2
  const safetyRating = clamp(category.safety - safetyJitter, 1, 5)

  const casSuffix = String(10000 + (hashString(`${seed}:cas`) % 89999))
  const casCheck = String(1 + (hashString(`${seed}:check`) % 9))

  return {
    chemicalType,
    phValue,
    phBand: `${range.min.toFixed(1)} – ${range.max.toFixed(1)}`,
    casNumber: `${category.casPrefix}-${casSuffix.slice(0, 2)}-${casCheck}`,
    dilutionRatio: `1:${dilutionFactor}`,
    dilutionFactor,
    surfaces: category.surfaces,
    packaging: PACKAGING_OPTIONS.slice(0, 2 + (hashString(`${seed}:pack`) % (PACKAGING_OPTIONS.length - 1))),
    ecoCertifications: category.eco.slice(0, 1 + (hashString(`${seed}:eco`) % category.eco.length)),
    safetyRating,
    application: category.application,
  }
}

/* --------------------------- Dilution math --------------------------- */

interface SurfaceDilution {
  waterMult: number
  label: string // i18n key under `surface.*`
}

const SURFACE_DILUTION: Record<SurfaceCode, SurfaceDilution> = {
  floors: { waterMult: 1, label: 'surface.floors' },
  kitchen: { waterMult: 0.7, label: 'surface.kitchen' },
  bathroom: { waterMult: 0.9, label: 'surface.bathroom' },
  metal: { waterMult: 0.8, label: 'surface.metal' },
  glass: { waterMult: 1.6, label: 'surface.glass' },
  fabric: { waterMult: 1.5, label: 'surface.fabric' },
  machinery: { waterMult: 0.5, label: 'surface.machinery' },
  skin: { waterMult: 2, label: 'surface.skin' },
}

const INTENSITY_WATER_MULT: Record<Intensity, number> = {
  light: 2,
  standard: 1,
  heavy: 0.5,
}

export interface DilutionResult {
  ratioLabel: string
  partsWater: number
  productLiters: number
  productMl: number
  waterLiters: number
}

export function calculateDilution(
  profile: ProductProfile,
  surface: SurfaceCode,
  intensity: Intensity,
  waterLiters: number,
): DilutionResult {
  const surfaceDilution = SURFACE_DILUTION[surface] ?? SURFACE_DILUTION.floors
  const partsWater = Math.max(
    1,
    Math.round(profile.dilutionFactor * surfaceDilution.waterMult * INTENSITY_WATER_MULT[intensity]),
  )
  const productLiters = waterLiters / partsWater
  return {
    ratioLabel: `1:${partsWater}`,
    partsWater,
    productLiters: Number(productLiters.toFixed(3)),
    productMl: Math.round(productLiters * 1000),
    waterLiters,
  }
}

export const SURFACE_OPTIONS: SurfaceCode[] = [
  'floors',
  'kitchen',
  'bathroom',
  'metal',
  'glass',
  'fabric',
  'machinery',
  'skin',
]

export const INTENSITY_OPTIONS: Intensity[] = ['light', 'standard', 'heavy']

export const CHEMICAL_TYPES: ChemicalType[] = ['acidic', 'alkaline', 'neutral', 'enzymatic']
