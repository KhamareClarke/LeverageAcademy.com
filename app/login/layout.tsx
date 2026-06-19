import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Leverage Academy account and access your AI systems and business infrastructure courses.',
  alternates: { canonical: '/login' },
  openGraph: {
    title: 'Sign In | Leverage Academy',
    description: 'Access your courses and continue building systems that compound.',
    url: 'https://leverageacademy.com/login',
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
