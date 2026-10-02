import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ar from './ar.json'
import en from './en.json'

export type Language = 'ar' | 'en'

const STORAGE_KEY = 'hash.language'

export function getStoredLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar'
}

function applyDirection(language: Language): void {
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
}

export function changeLanguage(language: Language): void {
  localStorage.setItem(STORAGE_KEY, language)
  applyDirection(language)
  void i18n.changeLanguage(language)
}

const initial = getStoredLanguage()
applyDirection(initial)

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: initial,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
})

export default i18n
