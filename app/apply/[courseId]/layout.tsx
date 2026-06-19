import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply for Course',
  description: 'Submit your application for a Leverage Academy course. Build real AI systems and business infrastructure alongside elite founders and operators.',
  robots: { index: false, follow: false },
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children
}
