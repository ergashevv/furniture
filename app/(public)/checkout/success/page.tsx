'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

export default function CheckoutSuccessPage() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(true)

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessPopup(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const steps = [
    {
      number: '1',
      title: 'Tasdiqlash qo\'ng\'irog\'i',
      description: 'Operatorimiz 30 daqiqa ichida qo\'ng\'iroq qiladi',
    },
    {
      number: '2',
      title: 'Buyurtma tayyorlanadi',
      description: '1-3 kun ichida mahsulot tayyorlanadi',
    },
    {
      number: '3',
      title: 'Yetkazib berish',
      description: 'Manzilingizga bepul yetkazamiz',
    },
  ]

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Success Popup Notification */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-500 min-w-[320px] max-w-md">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-700 mb-1">
                    Buyurtma qabul qilindi!
                  </h3>
                  <p className="text-sm text-text-light">
                    Tez orada siz bilan bog&apos;lanamiz
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-green-500 rounded-full mt-4"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Buyurtma qabul qilindi!
            </h1>
            <p className="text-text-light text-lg">
              Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog&apos;lanamiz.
            </p>
          </div>
        </ScrollReveal>

        {/* Next Steps */}
        <ScrollReveal delay={0.2}>
          <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Keyingi qadamlar:</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
                    <p className="text-text-light">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Contact Info */}
        <ScrollReveal delay={0.3}>
          <div className="bg-primary/5 rounded-2xl p-6 mb-8">
            <p className="text-center text-text-light mb-4">
              Savollaringiz bo&apos;lsa, biz bilan bog&apos;laning:
            </p>
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href="tel:+998901234567"
                className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
              >
                +998 90 123 45 67
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Action Buttons */}
        <ScrollReveal delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Bosh sahifa
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg hover:bg-primary/5 transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Xarid qilishni davom ettirish
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
