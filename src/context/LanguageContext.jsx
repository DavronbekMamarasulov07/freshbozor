import { useEffect, useMemo, useState } from 'react'
import { translations } from '../data/translations'
import { LanguageContext } from './contexts'

const STORAGE_KEY = 'freshbozor_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'uz' || saved === 'ru') return saved
    } catch {
      // ignore storage errors
    }
    return 'uz'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore storage errors
    }
  }, [lang])

  const value = useMemo(() => {
    const t = translations[lang] || translations.uz

    const localize = (field) => {
      if (field == null) return ''
      if (typeof field === 'string') return field
      return field[lang] ?? field.uz ?? ''
    }

    const formatPrice = (amount) => {
      const num = Math.round(Number(amount) || 0)
      const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return `${formatted} ${t.product.currency}`
    }

    const toggleLang = () => {
      setLang((prev) => (prev === 'uz' ? 'ru' : 'uz'))
    }

    return {
      lang,
      setLang,
      toggleLang,
      t,
      localize,
      formatPrice,
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
