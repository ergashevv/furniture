'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  price: string | null
  features: string[]
  order: number
  visible: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        if (data.success) {
          setServices(data.services)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

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

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Bizning Xizmatlarimiz
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Mebel ishlab chiqarishdan tortib o&apos;rnatishgacha
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-text-light">Yuklanmoqda...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ScrollReveal key={service.id} delay={index * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300 h-full flex flex-col">
                    <div
                      className={`w-16 h-16 mb-6 rounded-lg flex items-center justify-center ${
                        index % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                      }`}
                    >
                      {service.icon ? (
                        <span className="text-white text-2xl">{service.icon}</span>
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded"></div>
                      )}
                    </div>
                    <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
                      {service.name}
                    </h3>
                    <p className="text-text-light mb-6 flex-grow">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-text-light text-sm">
                            <span className="text-secondary mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-4 border-t border-primary/10">
                      {service.price && (
                        <div className="text-primary font-bold mb-3">{service.price}</div>
                      )}
                      <Link
                        href="/contact"
                        className="text-primary hover:text-secondary transition-colors font-medium text-sm inline-flex items-center"
                      >
                        Batafsil <span className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
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

      {/* Pricing Table Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                Xizmat Narxlari
              </h2>
              <p className="text-text-light text-lg">Shaffof va adolatli narxlar</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Xizmat turi</th>
                      <th className="px-6 py-4 text-left font-semibold">Narx</th>
                      <th className="px-6 py-4 text-left font-semibold">Muddat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {services.map((service, index) => (
                      <tr key={service.id} className={index % 2 === 0 ? 'bg-white' : 'bg-background'}>
                        <td className="px-6 py-4 font-medium text-primary">{service.name}</td>
                        <td className="px-6 py-4 text-text-light">{service.price || 'Murojaat qiling'}</td>
                        <td className="px-6 py-4 text-text-light">7-21 kun</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
