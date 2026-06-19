import type { Metadata } from 'next'
import './globals.css'
import { Playfair_Display } from 'next/font/google'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const fraunces = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://leverageacademy.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Leverage Academy | AI Systems & Business Infrastructure for Elite Builders',
    template: '%s | Leverage Academy',
  },
  description: 'A private education platform for builders designing AI systems, business infrastructure, and digital assets that compound exponentially. Application-based. Results-driven.',
  keywords: ['AI systems', 'business infrastructure', 'digital assets', 'automation', 'leverage', 'online education', 'founders', 'builders', 'AI training', 'systems thinking'],
  authors: [{ name: 'Khamare Clarke', url: `${BASE_URL}/about` }],
  creator: 'Khamare Clarke',
  publisher: 'Leverage Academy',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'Leverage Academy',
    title: 'Leverage Academy | AI Systems & Business Infrastructure for Elite Builders',
    description: 'Build systems. Create leverage. Own the outcome. A private education platform for elite builders designing AI systems and business infrastructure that compound exponentially.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leverage Academy | AI Systems for Elite Builders',
    description: 'Build systems. Create leverage. Own the outcome. A private education platform for builders designing AI systems and business infrastructure that compound.',
    creator: '@leverageacademy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Leverage Academy',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'A private education platform for builders designing AI systems, business infrastructure, and digital assets that compound over time.',
  founder: {
    '@type': 'Person',
    name: 'Khamare Clarke',
    jobTitle: 'Founder & Chief Architect',
    url: `${BASE_URL}/about`,
    knowsAbout: ['AI Systems', 'Business Infrastructure', 'Digital Assets', 'Automation', 'Venture Design'],
  },
  knowsAbout: [
    'Artificial Intelligence',
    'Business Infrastructure',
    'Digital Assets',
    'Automation',
    'Systems Thinking',
    'Venture Design',
  ],
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Leverage Academy',
  url: BASE_URL,
  description: 'Private education platform for elite builders designing AI systems and business infrastructure.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('la_theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
