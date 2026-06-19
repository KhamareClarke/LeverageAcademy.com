'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

import GB from 'country-flag-icons/react/3x2/GB'
import ET from 'country-flag-icons/react/3x2/ET'
import ES from 'country-flag-icons/react/3x2/ES'
import BR from 'country-flag-icons/react/3x2/BR'
import FR from 'country-flag-icons/react/3x2/FR'
import DE from 'country-flag-icons/react/3x2/DE'
import IT from 'country-flag-icons/react/3x2/IT'
import NL from 'country-flag-icons/react/3x2/NL'
import PL from 'country-flag-icons/react/3x2/PL'
import RU from 'country-flag-icons/react/3x2/RU'
import TR from 'country-flag-icons/react/3x2/TR'
import SA from 'country-flag-icons/react/3x2/SA'
import IN from 'country-flag-icons/react/3x2/IN'
import CN from 'country-flag-icons/react/3x2/CN'
import JP from 'country-flag-icons/react/3x2/JP'
import KR from 'country-flag-icons/react/3x2/KR'
import ID from 'country-flag-icons/react/3x2/ID'
import VN from 'country-flag-icons/react/3x2/VN'
import TH from 'country-flag-icons/react/3x2/TH'
import SE from 'country-flag-icons/react/3x2/SE'

const FlagIcon = ({ className }: { className?: string }) => <span className={className} />

export const LANGUAGES = [
  { code: 'en-GB', label: 'English',    region: 'United Kingdom',  Flag: GB },
  { code: 'am',    label: 'አማርኛ',      region: 'ኢትዮጵያ',          Flag: ET },
  { code: 'es',    label: 'Español',    region: 'España',          Flag: ES },
  { code: 'pt-BR', label: 'Português',  region: 'Brasil',          Flag: BR },
  { code: 'fr',    label: 'Français',   region: 'France',          Flag: FR },
  { code: 'de',    label: 'Deutsch',    region: 'Deutschland',     Flag: DE },
  { code: 'it',    label: 'Italiano',   region: 'Italia',          Flag: IT },
  { code: 'nl',    label: 'Nederlands', region: 'Nederland',       Flag: NL },
  { code: 'pl',    label: 'Polski',     region: 'Polska',          Flag: PL },
  { code: 'ru',    label: 'Русский',    region: 'Россия',          Flag: RU },
  { code: 'tr',    label: 'Türkçe',     region: 'Türkiye',         Flag: TR },
  { code: 'ar',    label: 'العربية',    region: 'السعودية',        Flag: SA },
  { code: 'hi',    label: 'हिंदी',      region: 'भारत',            Flag: IN },
  { code: 'zh',    label: '中文',       region: '中国',             Flag: CN },
  { code: 'ja',    label: '日本語',     region: '日本',             Flag: JP },
  { code: 'ko',    label: '한국어',     region: '한국',             Flag: KR },
  { code: 'id',    label: 'Bahasa',     region: 'Indonesia',       Flag: ID },
  { code: 'vi',    label: 'Tiếng Việt', region: 'Việt Nam',        Flag: VN },
  { code: 'th',    label: 'ภาษาไทย',   region: 'ไทย',             Flag: TH },
  { code: 'sv',    label: 'Svenska',    region: 'Sverige',         Flag: SE },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: typeof LANGUAGES[0]) => {
    setLocale(lang.code)
    setIsOpen(false)
  }

  const SelectedFlag = selected.Flag

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] hover:border-gold-400/25 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer group"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <SelectedFlag className="w-5 h-auto rounded-[2px] flex-shrink-0" title={selected.label} />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="w-3 h-3 text-type-100/50 group-hover:text-type-100 transition-colors duration-200" />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2.5 w-56 rounded-2xl border border-white/[0.08] bg-main-900/97 backdrop-blur-2xl shadow-glow-md overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/[0.05]">
              <p className="text-[10px] text-type-100/40 uppercase tracking-[0.2em] font-semibold">Select Language</p>
            </div>

            {/* Grid */}
            <div className="p-2 grid grid-cols-5 gap-1 max-h-[22rem] overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isActive = lang.code === locale
                const { Flag } = lang
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    title={`${lang.label}, ${lang.region}`}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-gold-400/[0.09] border border-gold-400/20'
                        : 'hover:bg-white/[0.05] border border-transparent'
                    }`}
                  >
                    <Flag className="w-7 h-auto rounded-[3px] shadow-sm" title={lang.region} />
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[0.05]">
              <p className="text-[10px] text-type-100/25">
                20 languages · Full translations rolling out progressively
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
