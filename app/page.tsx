import FloatingNav from '@/components/FloatingNav'
import Hero from '@/components/Hero'
import BentoGrid from '@/components/BentoGrid'
import CoursesSection from '@/components/CoursesSection'
import ProductDepth from '@/components/ProductDepth'
import AuthoritySection from '@/components/AuthoritySection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { PageLayout } from '@/components/layout/page-layout'

export default function Home() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-main-950 text-type-50 overflow-hidden flex-1">
        <FloatingNav />
        <Hero />
        <BentoGrid />
        <CoursesSection />
        <ProductDepth />
        <AuthoritySection />
        <FAQSection />
        <Footer />
      </main>
    </PageLayout>
  )
}
