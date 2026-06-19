import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Leverage Academy privacy policy: how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: false },
}

export default function PrivacyPage() {
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
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-type-100 mb-12">Last updated: January 2025</p>

        <div className="space-y-10 text-type-100 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">1. Information We Collect</h2>
            <p>When you create an account or apply for a course, we collect your name, email address, and the goals and experience level you provide in your application. We also collect usage data such as pages visited and course progress.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to manage your account, process your application, deliver course content, and send you relevant communications about your enrollment and platform updates. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">3. Data Storage</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL). Payment processing is handled by Stripe. Neither Leverage Academy nor our processors store full payment card details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">4. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at the address below. UK and EU residents have additional rights under GDPR and UK GDPR.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">5. Cookies</h2>
            <p>We use essential cookies for authentication only. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-type-50 mb-4">6. Contact</h2>
            <p>For privacy-related enquiries, contact us via <Link href="/contact" className="text-gold-400 hover:text-gold-300">our contact page</Link>.</p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
