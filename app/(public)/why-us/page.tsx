'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  location: string | null
  avatar: string | null
  visible: boolean
  featured: boolean
}

export default function WhyUsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews?visible=true&featured=true')
        const data = await response.json()
        if (data.success) {
          setReviews(data.reviews.slice(0, 3)) // First 3 featured reviews
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [])

  const stats = [
    { number: '15+', label: 'Yillik tajriba' },
    { number: '2500+', label: 'Bajarilgan loyihalar' },
    { number: '5000+', label: 'Mamnun mijozlar' },
    { number: '100%', label: 'Sifat kafolati' },
  ]

  const features = [
    {
      title: 'Premium Materiallar',
      description:
        'Faqat ishonchli yetkazib beruvchilardan eng yaxshi materiallardan foydalanamiz. Import qilingan yog\'och, premium sifatli shisha va ekologik toza bo\'yoqlar.',
      features: ['Import qilingan yog\'och', 'Premium sifatli shisha', 'Ekologik toza bo\'yoqlar'],
    },
    {
      title: 'O\'z Ishlab Chiqarish',
      description:
        '5000 m² zamonaviy fabrikamizda CNC dastgohlarida yuqori aniqlikda ishlab chiqaramiz. To\'liq sifat nazorati va raqobatbardosh narxlar.',
      features: ['5000+ m² ishlab chiqarish maydoni', 'Zamonaviy CNC dastgohlari', '50+ Tajribali mutaxassislar'],
    },
    {
      title: 'Individual O\'lcham',
      description:
        'Har bir mebel individual o\'lchamda va dizaynda yaratiladi. Bepul o\'lchov xizmati, 3D dizayn loyihasi va millimetrgacha aniqlik.',
      features: ['Bepul o\'lchov xizmati', '3D dizayn loyihasi', 'Millimetrgacha aniqlik'],
    },
    {
      title: 'Kafolat va Xizmat',
      description:
        'Barcha mahsulotlarimizga 1-3 yil kafolat beramiz. Kafolat davrida yuzaga kelgan har qanday muammoni bepul hal qilamiz.',
      features: ['1-3 yil kafolat', 'Bepul ta\'mirlash', '24/7 qo\'llab-quvvatlash'],
    },
    {
      title: 'Yetkazib Berish',
      description:
        'O\'z yetkazib berish xizmatimiz orqali mahsulotlarni xavfsiz va tezkor yetkazamiz. Toshkent bo\'ylab bepul yetkazib berish.',
      features: ['Toshkentda bepul yetkazish', 'Viloyatlarga yetkazish', 'O\'rnatish xizmati'],
    },
    {
      title: 'Rang Tanlash',
      description:
        'Keng rang palitrasi sizning interieringizga mos keladi. 100+ dan ortiq rang variantlari orasidan tanlang.',
      features: ['100+ rang varianti', 'Rang namunalari', 'Professional maslahat'],
    },
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Murojaat',
      description: 'Bizga qo\'ng\'iroq qiling yoki saytimiz orqali buyurtma bering',
    },
    {
      step: '2',
      title: 'Maslahat va O\'lchov',
      description: 'Bepul maslahat va o\'lchov xizmati. Uyingizga kelib, aniq o\'lchamlarni olamiz',
    },
    {
      step: '3',
      title: 'Ishlab Chiqarish',
      description: 'Professional ustalarimiz sizning buyurtmangizni 7-21 kun ichida tayyorlaydi',
    },
    {
      step: '4',
      title: 'Yetkazish va O\'rnatish',
      description: 'Tayyor mahsulotni uyingizga yetkazamiz va professional tarzda o\'rnatamiz',
    },
  ]

  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const getAvatarColor = (index: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-primary']
    return colors[index % colors.length]
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Sifat va Ishonch Birinchi O&apos;rinda
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              10 yildan ortiq tajriba, minglab mamnun mijozlar va yuqori sifatli mahsulotlar - biz
              sizning ishonchingizni oqlashga tayyor.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Statistics Section - Moved to top */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-serif font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - 6 cards */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                Bizni tanlashingiz uchun sabablar
              </h2>
              <p className="text-text-light text-lg">
                Biz nafaqat mebel ishlab chiqaramiz - biz sizning orzularingizni amalga oshiramiz
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300 h-full flex flex-col">
                  <div
                    className={`w-16 h-16 mb-6 rounded-lg flex items-center justify-center ${
                      index % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <span className="text-white text-2xl font-bold">✓</span>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-light mb-6 flex-grow">{feature.description}</p>
                  {feature.features && feature.features.length > 0 && (
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-text-light text-sm">
                          <span className="text-secondary mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                Biz Bilan Ishlash Jarayoni
              </h2>
              <p className="text-text-light text-lg">
                Oddiy va qulay jarayon orqali orzuingizdagi mebelga ega bo&apos;ling
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ScrollReveal key={step.step} delay={index * 0.1}>
                <div className="text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-lg flex items-center justify-center text-white text-3xl font-serif font-bold ${
                      index % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-light">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      {reviews.length > 0 && (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                  Mijozlarimiz Fikrlari
                </h2>
                <p className="text-text-light text-lg">
                  Mamnun mijozlarimizning haqiqiy fikrlari
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <ScrollReveal key={review.id} delay={index * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-text-light mb-6 flex-grow">{review.comment}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
                      <div
                        className={`w-12 h-12 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                      >
                        {review.avatar || getAvatarInitial(review.customerName)}
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{review.customerName}</div>
                        {review.location && (
                          <div className="text-sm text-text-light">{review.location}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Orzuingizdagi mebelni birga yaratamiz
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Bepul maslahat va o&apos;lchov xizmati. Hoziroq bog&apos;laning va loyihangizni
              boshlang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold uppercase tracking-wide"
              >
                Buyurtma berish
              </Link>
              <a
                href="tel:+998901234567"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold uppercase tracking-wide flex items-center justify-center gap-2"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +998 90 123 45 67
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
