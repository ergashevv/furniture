'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export default function OrderSuccessPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Success Banner */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-700 font-medium">
            Buyurtmangiz qabul qilindi! Tez orada siz bilan bog&apos;lanamiz.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary text-center mb-4">
              Buyurtmangiz qabul qilindi!
            </h1>
            <p className="text-text-light text-center mb-12">
              Rahmat! Sizning buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorlarimiz siz bilan bog&apos;lanishadi.
            </p>

            {/* Steps Card */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <h2 className="text-lg font-semibold text-primary mb-6">Keyingi qadamlar:</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Tasdiqlash qo&apos;ng&apos;irog&apos;i</h3>
                    <p className="text-text-light text-sm">Operatorimiz 30 daqiqa ichida qo&apos;ng&apos;iroq qiladi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Buyurtma tayyorlanadi</h3>
                    <p className="text-text-light text-sm">1-3 kun ichida mahsulot tayyorlanadi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Yetkazib berish</h3>
                    <p className="text-text-light text-sm">Manzilingizga bepul yetkazamiz</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 text-center">
              <p className="text-text-light mb-3">Savollaringiz bo&apos;lsa, biz bilan bog&apos;laning:</p>
              <a href="tel:+998901234567" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:text-primary-dark transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +998 90 123 45 67
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Bosh sahifa
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Xarid qilishni davom ettirish
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
