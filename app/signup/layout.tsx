import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Leverage Academy account and apply to AI systems and business infrastructure courses built for elite builders.',
  alternates: { canonical: '/signup' },
  openGraph: {
    title: 'Create Account | Leverage Academy',
    description: 'Join an exclusive platform for builders designing systems that compound exponentially.',
    url: 'https://leverageacademy.com/signup',
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
