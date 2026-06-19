import { ReactNode } from 'react'
import { Container } from '@/components/ui/container'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'default' | 'dark' | 'glow'
  id?: string
}

export default function Section({ children, className = '', background = 'default', id }: SectionProps) {
  const backgrounds = {
    default: 'bg-black',
    dark: 'bg-near-black',
    glow: 'bg-black relative overflow-hidden before:absolute before:inset-0 before:bg-radial-gradient before:from-gold/5 before:to-transparent before:opacity-30'
  }

  return (
    <section id={id} className={`relative py-24 md:py-32 ${backgrounds[background]} ${className}`}>
      <Container size="wide" className="relative z-10 px-6 md:px-8 !max-w-7xl">
        {children}
      </Container>
    </section>
  )
}
