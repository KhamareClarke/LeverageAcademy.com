'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const LINKS = {
    [t.footer.platformHeading]: [
      { label: t.footer.courses, href: '/#courses' },
      { label: t.footer.apply, href: '/#courses' },
      { label: t.footer.studentDashboard, href: '/student' },
      { label: t.footer.faq, href: '/#faq' },
    ],
    [t.footer.companyHeading]: [
      { label: t.footer.about, href: '/about' },
      { label: t.footer.contact, href: '/contact' },
      { label: t.footer.privacy, href: '/privacy' },
      { label: t.footer.terms, href: '/terms' },
    ],
  }

  return (
    <footer className="relative border-t border-white/[0.08]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

      <Container size="wide" className="px-6 md:px-8 !max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-20 pt-16 sm:pt-20 pb-14 sm:pb-16">

          {/* Brand column */}
          <div className="flex flex-col gap-6 max-w-xs">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0 shadow-glow-gold">
                <span className="text-black font-black text-base">L</span>
              </div>
              <span className="text-type-50 font-semibold text-base tracking-tight group-hover:text-gold-400 transition-colors duration-200">
                Leverage Academy
              </span>
            </Link>

            <p className="text-type-100/60 text-sm leading-[1.8]">{t.footer.description}</p>
            <p className="text-type-100/35 text-xs uppercase tracking-[0.18em]">{t.footer.enrollment}</p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-5">
              <p className="text-type-50 text-xs font-semibold uppercase tracking-[0.18em]">{heading}</p>
              <ul className="flex flex-col gap-3.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-type-100/55 hover:text-type-50 text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-type-100/35 text-xs tracking-wide">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <p className="text-type-100/25 text-xs tracking-wider uppercase">{t.footer.tagline}</p>
        </div>
      </Container>
    </footer>
  )
}
