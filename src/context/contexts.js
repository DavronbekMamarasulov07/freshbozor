import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)
export const LanguageContext = createContext(null)
export const StoreContext = createContext(null)

export const FREE_DELIVERY_THRESHOLD = 150000
export const STANDARD_DELIVERY_FEE = 15000

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
