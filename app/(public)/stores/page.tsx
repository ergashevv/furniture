'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

interface Store {
  id: string
  name: string
  address: string
  phone: string | null
  email: string | null
  workingHours: string | null
  latitude: number | null
  longitude: number | null
  order: number
  visible: boolean
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch('/api/stores')
        const data = await response.json()
        if (data.success) {
          setStores(data.stores)
        }
      } catch (error) {
        console.error('Error fetching stores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Filiallarimiz
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              O&apos;zingizga eng yaqin Furni Glass filialini toping
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-background-dark rounded-2xl overflow-hidden shadow-soft h-[600px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.904453776686!2d69.24045131542346!3d41.31191897927081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </ScrollReveal>
            </div>

            {/* Stores List */}
            <div>
              <ScrollReveal delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                    Barcha filiallar
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : stores.length === 0 ? (
                    <p className="text-text-light text-center py-8">
                      Hozircha filiallar mavjud emas
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {stores.map((store) => (
                        <div key={store.id} className="border-b border-primary/10 pb-6 last:border-0 last:pb-0">
                          <h3 className="text-lg font-serif font-semibold text-primary mb-3">
                            {store.name}
                          </h3>
                          <p className="text-text-light text-sm mb-3">{store.address}</p>
                          {store.phone && (
                            <div className="flex items-center text-text-light text-sm mb-2">
                              <svg
                                className="w-4 h-4 mr-2 text-primary"
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
                              {store.phone}
                            </div>
                          )}
                          {store.email && (
                            <div className="flex items-center text-text-light text-sm mb-2">
                              <svg
                                className="w-4 h-4 mr-2 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {store.email}
                            </div>
                          )}
                          {store.workingHours && (
                            <div className="flex items-center text-text-light text-sm">
                              <svg
                                className="w-4 h-4 mr-2 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {store.workingHours}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
