import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Leverage Academy. Questions about courses, applications, or partnerships.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Leverage Academy',
    description: 'Get in touch with the Leverage Academy team.',
    url: 'https://leverageacademy.com/contact',
  },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Leverage Academy',
  url: 'https://leverageacademy.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Leverage Academy',
    url: 'https://leverageacademy.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main className="min-h-screen bg-main-950 text-type-50">
        <div className="border-b border-white/5 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-type-200/20 flex items-center justify-center">
                <span className="text-type-200 font-bold text-sm">L</span>
              </div>
              <span className="text-type-50 font-semibold text-sm tracking-tight">Leverage Academy</span>
            </Link>
          </div>
        </div>

        <section className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/30 bg-gold-400/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="text-gold-400 text-xs uppercase tracking-widest font-bold">Get in Touch</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Contact</h1>
          <p className="text-type-100 text-xl leading-relaxed mb-12">
            Questions about an application, course content, or partnership opportunities? We read every message.
          </p>

          <div className="space-y-4 text-left">
            {[
              { label: 'Course Applications', info: 'Apply directly from the course page. Applications are reviewed within 48 hours.' },
              { label: 'Refund Requests', info: '30-day full refund policy. Submit a request and we will process it within 5 business days.' },
              { label: 'General Enquiries', info: 'For all other questions, use the form below or reach out via the platform.' },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl border border-gold-400/10 bg-white/2 text-left">
                <h2 className="font-bold text-gold-400 mb-2">{item.label}</h2>
                <p className="text-type-100 text-sm leading-relaxed">{item.info}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/#courses"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-gold text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
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
