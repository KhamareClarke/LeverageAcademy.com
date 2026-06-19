import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Khamare Clarke & Leverage Academy',
  description: 'Meet Khamare Clarke, Founder & Chief Architect of Leverage Academy. 500+ systems built, 50+ ventures launched, 8+ years building leverage infrastructure, £10M+ revenue generated.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Khamare Clarke | Leverage Academy',
    description: '500+ systems built. 50+ ventures launched. 8+ years of building leverage infrastructure. This is the proof behind the platform.',
    url: 'https://leverageacademy.com/about',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Khamare Clarke',
  jobTitle: 'Founder & Chief Architect',
  worksFor: {
    '@type': 'EducationalOrganization',
    name: 'Leverage Academy',
    url: 'https://leverageacademy.com',
  },
  description: 'Builder, operator, and systems architect with 8+ years designing AI systems, business infrastructure, and digital assets. Founder of Leverage Academy.',
  url: 'https://leverageacademy.com/about',
  knowsAbout: [
    'AI Systems Architecture',
    'Business Infrastructure',
    'Automation',
    'Venture Design',
    'Digital Assets',
    'Revenue Infrastructure',
    'Systems Thinking',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: '500+ Operational Systems Built' },
    { '@type': 'EducationalOccupationalCredential', name: '50+ Ventures Launched' },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <main className="min-h-screen bg-main-950 text-type-50">
        {/* Nav */}
        <div className="border-b border-white/5 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-type-200/20 flex items-center justify-center">
                <span className="text-type-200 font-bold text-sm">L</span>
              </div>
              <span className="text-type-50 font-semibold text-sm tracking-tight">Leverage Academy</span>
            </Link>
            <Link href="/#courses" className="text-sm text-type-100 hover:text-gold-400 transition-colors">
              Browse Courses →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="relative py-32 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-gold-400/5 to-transparent" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-gold-400/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">The Founder</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Khamare Clarke
            </h1>
            <p className="text-gold-400 text-xl font-semibold mb-8 uppercase tracking-widest">
              Founder & Chief Architect
            </p>
            <p className="text-type-100 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Builder. Operator. Systems architect. 8+ years designing infrastructure that compounds, from AI agent workflows to multi-venture business portfolios.
            </p>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '500+', label: 'Systems Built', sub: 'Operational frameworks deployed across industries' },
                { value: '50+', label: 'Ventures Launched', sub: 'Businesses architected and scaled from zero' },
                { value: '8+', label: 'Years Operating', sub: 'Building leverage infrastructure since 2016' },
                { value: '£10M+', label: 'Revenue Generated', sub: 'Across ventures built on these frameworks' },
              ].map((stat) => (
                <div key={stat.label} className="p-8 rounded-2xl border border-gold-400/10 bg-white/2 text-center">
                  <div className="font-serif text-5xl md:text-6xl font-bold text-gold-400 mb-2">{stat.value}</div>
                  <div className="text-type-50 font-bold text-sm uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-type-100 text-xs leading-relaxed">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12">The philosophy</h2>
            <div className="space-y-8 text-type-100 text-lg leading-relaxed">
              <p>
                Most education teaches you what to think. Leverage Academy teaches you how to build systems that think, execute, and scale for you.
              </p>
              <p>
                The difference between people who create leverage and those who stay linear isn't intelligence, it's architecture. Leverage Academy exists to teach that architecture.
              </p>
              <blockquote className="border-l-2 border-gold-400 pl-6 my-12">
                <p className="font-serif text-2xl md:text-3xl text-type-50 italic leading-relaxed">
                  "Most people optimize for speed. We optimize for systems. The difference compounds exponentially."
                </p>
                <footer className="mt-4 text-gold-400 font-bold italic">Khamare Clarke</footer>
              </blockquote>
              <p>
                After 8 years of building AI workflows, revenue infrastructure, knowledge systems, and distribution engines, the frameworks are proven. Leverage Academy packages that operational knowledge into structured programs that produce real outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16 text-center">Areas of expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  area: 'AI Systems Architecture',
                  description: 'Designing autonomous agent workflows that execute complex multi-step tasks without human intervention. From LLM orchestration to tool-use pipelines.',
                },
                {
                  area: 'Revenue Infrastructure',
                  description: 'Building monetization systems: pricing architecture, offer structures, and payment flows that generate income independently of active hours worked.',
                },
                {
                  area: 'Business Infrastructure',
                  description: 'Operational frameworks that allow ventures to scale without proportional increases in team size. Systems replace management overhead.',
                },
                {
                  area: 'Venture Design',
                  description: 'Architecting businesses as products from day one, with built-in distribution, clear unit economics, and compounding mechanics built into the model.',
                },
                {
                  area: 'Knowledge Systems',
                  description: 'Information architectures that capture, organize, and deploy expertise at scale. Your knowledge becomes an asset that works independently.',
                },
                {
                  area: 'Distribution Engines',
                  description: 'Automated audience growth and influence mechanisms. Systematic reach-building that compounds without daily manual effort.',
                },
              ].map((item) => (
                <div key={item.area} className="p-8 rounded-2xl border border-gold-400/10 bg-white/2">
                  <h3 className="text-xl font-bold text-gold-400 mb-3">{item.area}</h3>
                  <p className="text-type-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 border-t border-white/5 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready to build systems?
            </h2>
            <p className="text-type-100 text-xl mb-10">
              Leverage Academy is application-based. We work with builders who are serious about creating infrastructure that compounds.
            </p>
            <Link
              href="/#courses"
              className="inline-flex items-center gap-2 px-12 py-5 bg-gradient-gold text-black font-bold rounded-xl shadow-glow-gold-lg hover:opacity-90 transition-opacity"
            >
              Browse Courses →
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
