'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, User, Mail, Target, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  goals: string
  experienceLevel: string
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    goals: '',
    experienceLevel: '',
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          name: formData.name,
          email: formData.email,
          goals: formData.goals,
          experience_level: formData.experienceLevel,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit application')
        setLoading(false)
        return
      }

      // Success - redirect to success page
      router.push(`/apply/${courseId}/success`)
    } catch (err: any) {
      setError('Failed to submit application. Please try again.')
      setLoading(false)
    }
  }

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - Just starting out' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'advanced', label: 'Advanced - Extensive experience' },
  ]

  return (
    <main className="min-h-screen bg-main-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
      <div className="w-full max-w-2xl">
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        step <= currentStep
                          ? 'bg-gradient-gold text-black'
                          : 'bg-main-900 border border-gold-400/20 text-type-100'
                      }`}
                    >
                      {step < currentStep ? <Check className="w-5 h-5" /> : step}
                    </div>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        step < currentStep ? 'bg-gradient-gold' : 'bg-main-900'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-type-100">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Name */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-type-50">Your Name</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-type-50 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-type-50">Your Email</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-type-50 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-type-50">Your Goals</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-type-50 mb-2">
                    What are your goals for this course?
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 placeholder-type-200 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                    placeholder="Tell us about your goals and what you hope to achieve..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Experience Level */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-type-50">Experience Level</h2>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-type-50 mb-4">
                    What is your experience level?
                  </label>
                  <div className="space-y-3">
                    {experienceLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.experienceLevel === level.value
                            ? 'border-gold-400 bg-gold-400/10'
                            : 'border-gold-400/20 bg-main-900 hover:border-gold-400/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="experience"
                          value={level.value}
                          checked={formData.experienceLevel === level.value}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                          className="sr-only"
                          required
                        />
                        <div className="text-type-50 font-medium">{level.label}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gold-400/10">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-main-900 border border-gold-400/20 text-type-50 font-semibold hover:border-gold-400/50 transition-colors flex items-center gap-2"
              >
                Cancel
              </Link>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.name) ||
                  (currentStep === 2 && !formData.email) ||
                  (currentStep === 3 && !formData.goals)
                }
                className="px-6 py-3 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.experienceLevel || loading}
                className="px-6 py-3 rounded-xl bg-gradient-gold text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
