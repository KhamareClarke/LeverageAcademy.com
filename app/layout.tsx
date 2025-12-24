import type { Metadata } from 'next'
import './globals.css'
import { Fraunces } from 'next/font/google'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Leverage Academy',
  description: 'A private education platform for builders designing AI systems, business infrastructure, and digital assets that compound over time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
