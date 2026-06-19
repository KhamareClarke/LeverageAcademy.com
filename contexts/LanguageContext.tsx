'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getTranslations, type SiteTranslations } from '@/lib/translations'

const DEFAULT_LOCALE = 'en-GB'

type LanguageContextType = {
  locale: string
  setLocale: (code: string) => void
  t: SiteTranslations
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: getTranslations(DEFAULT_LOCALE),
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = localStorage.getItem('la_locale')
    if (stored) setLocaleState(stored)
  }, [])

  const setLocale = (code: string) => {
    setLocaleState(code)
    localStorage.setItem('la_locale', code)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getTranslations(locale) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
