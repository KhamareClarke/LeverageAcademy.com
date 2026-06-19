import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Leverage Academy terms of service: the rules and agreements governing your use of the platform.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: false },
}

export default function TermsPage() {
  return (
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

      <article className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-type-100 mb-12">Last updated: January 2025</p>

        <div className="space-y-10 text-type-100 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">1. Acceptance</h2>
            <p>By creating an account or enrolling in any Leverage Academy course, you agree to these terms. If you do not agree, do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">2. Access & Eligibility</h2>
            <p>Leverage Academy is an application-based platform. Acceptance is at our sole discretion. You must be 18 or older to enroll. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">3. Intellectual Property</h2>
            <p>All course content, frameworks, templates, and materials are the intellectual property of Leverage Academy. You may not reproduce, redistribute, or resell any content without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">4. Refund Policy</h2>
            <p>We offer a 30-day full refund if the platform is not what you expected. Requests must be submitted within 30 days of your initial enrollment. No questions asked.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">5. Prohibited Conduct</h2>
            <p>You may not share your account credentials, record or redistribute course content, or use the platform for any unlawful purpose. Violation may result in immediate termination of access without refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">6. Limitation of Liability</h2>
            <p>Leverage Academy provides education and frameworks. We make no guarantees of specific financial results. Results depend entirely on your own effort, application, and circumstances.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">7. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">8. Contact</h2>
            <p>Questions? <Link href="/contact" className="text-gold-400 hover:text-gold-300">Contact us here</Link>.</p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
