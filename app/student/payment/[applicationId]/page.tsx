'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard } from 'lucide-react'

interface Application {
  id: string
  course: {
    id: string
    title: string
    price: number
  }
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.applicationId as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [])

  const fetchApplication = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      const foundApp = data.applications?.find((a: Application) => a.id === applicationId)
      setApplication(foundApp || null)
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)

    try {
      // In a real app, you would integrate with Stripe, PayPal, etc.
      // For now, we'll simulate a successful payment
      const paymentId = `pay_${Date.now()}`

      // Get enrollment ID
      const enrollmentsRes = await fetch('/api/enrollments')
      const enrollmentsData = await enrollmentsRes.json()
      const enrollment = enrollmentsData.enrollments?.find(
        (e: any) => e.course_id === application?.course.id
      )

      if (enrollment) {
        const paymentRes = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollment_id: enrollment.id,
            payment_id: paymentId,
          }),
        })

        if (paymentRes.ok) {
          router.push(`/student/courses/${application?.course.id}`)
        } else {
          alert('Payment failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Loading...</div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center text-type-100">Application not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 rounded-3xl border border-gold-400/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2 text-type-50">
            Complete Payment
          </h1>
          <p className="text-type-100">You've been approved for this course</p>
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-main-900 border border-gold-400/10">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-type-50 font-semibold">{application.course.title}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gold-400/10">
            <span className="text-type-100">Total Amount</span>
            <span className="text-3xl font-bold text-gold-400">£{application.course.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-yellow-400/10 border border-yellow-400/30">
          <p className="text-sm text-yellow-400">
            <strong>Note:</strong> This is a demo payment. In production, you would integrate with a payment provider like Stripe.
          </p>
        </div>

        <motion.button
          onClick={handlePayment}
          disabled={processing}
          whileHover={{ scale: processing ? 1 : 1.02 }}
          whileTap={{ scale: processing ? 1 : 0.98 }}
          className="w-full relative px-6 py-4 bg-gradient-gold text-black text-base font-bold rounded-xl overflow-hidden group shadow-glow-gold-lg disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-animated bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10">
            {processing ? 'Processing...' : 'Complete Payment'}
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}

