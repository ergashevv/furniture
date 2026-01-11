'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

const contactSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgi bo\'lishi kerak'),
  phone: z.string().min(9, 'Telefon raqami to\'liq kiritilishi kerak'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Xabar kamida 10 ta belgi bo\'lishi kerak'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactMethods = [
  {
    icon: '📞',
    name: 'Telefon',
    value: '+998 90 123 45 67',
    href: 'tel:+998901234567',
    bgColor: 'bg-primary',
  },
  {
    icon: '✈️',
    name: 'Telegram',
    value: '@furniglass',
    href: 'https://t.me/furniglass',
    bgColor: 'bg-blue-500',
  },
  {
    icon: '💬',
    name: 'WhatsApp',
    value: '+998 90 123 45 67',
    href: 'https://wa.me/998901234567',
    bgColor: 'bg-green-500',
  },
  {
    icon: '📧',
    name: 'Email',
    value: 'info@furniglass.uz',
    href: 'mailto:info@furniglass.uz',
    bgColor: 'bg-primary',
  },
]

const subjectOptions = [
  { value: 'order', label: 'Buyurtma haqida' },
  { value: 'question', label: 'Savol' },
  { value: 'complaint', label: 'Shikoyat' },
  { value: 'suggestion', label: 'Taklif' },
  { value: 'other', label: 'Boshqa' },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Biz Bilan Bog&apos;laning
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Savollaringiz bormi? Bizga yozing va biz tez orada javob beramiz
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <ScrollReveal key={method.name} delay={index * 0.1}>
                <Link
                  href={method.href}
                  className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-medium transition-shadow duration-300 block"
                >
                  <div className={`w-16 h-16 ${method.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{method.name}</h3>
                  <p className="text-text-light text-sm">{method.value}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                  Xabar Yuborish
                </h2>
                <p className="text-text-light mb-8">
                  Formani to&apos;ldiring va biz 15 daqiqa ichida siz bilan bog&apos;lanamiz.
                </p>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-secondary/20 text-secondary rounded-lg">
                    Xabar yuborildi! Tez orada siz bilan bog&apos;lanamiz.
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-primary font-medium mb-2">
                      Ismingiz
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="Ismingizni kiriting"
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-primary font-medium mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="+998 __ ___ __ __"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-primary font-medium mb-2">
                      Mavzu
                    </label>
                    <select
                      id="subject"
                      {...register('subject')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                    >
                      <option value="">Mavzuni tanlang</option>
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-primary font-medium mb-2">
                      Xabar
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                      placeholder="Xabaringizni yozing..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors duration-300 font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish →'}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-sm text-text-light">
                    <span>⚡ 15 daqiqada javob</span>
                    <span>🔒 Ma&apos;lumotlar himoyada</span>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            {/* Office Info */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-6">Bosh Ofis</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-text-light">
                          Toshkent, Yunusobod tumani, Amir Temur ko&apos;chasi 15
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0"
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
                      <div>
                        <p className="text-text-light">Ish vaqti:</p>
                        <p className="text-text-light">Du-Ju: 09:00 - 19:00</p>
                        <p className="text-text-light">Sha-Yak: 10:00 - 17:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                    Ko&apos;rgazma Zali
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-text-light">
                          Toshkent, Chilonzor tumani, Bunyodkor ko&apos;chasi 42
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-5 h-5 mr-3 mt-1 flex-shrink-0"></div>
                      <div>
                        <p className="text-text-light font-medium mb-2">Mavjud:</p>
                        <p className="text-text-light">200+ mebel namunalari</p>
                        <p className="text-text-light">Bepul maslahat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft h-[500px]">
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
      </section>

      {/* Social Media Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Ijtimoiy Tarmoqlarda
            </h2>
            <p className="text-text-light text-lg mb-12">
              Bizni kuzatib boring va yangiliklar, chegirmalardan xabardor bo&apos;ling
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Instagram', icon: '📷', followers: '15K+', href: '#' },
              { name: 'Telegram', icon: '✈️', followers: '10K+', href: '#' },
              { name: 'Facebook', icon: '👥', followers: '8K+', href: '#' },
              { name: 'YouTube', icon: '📹', followers: '5K+', href: '#' },
            ].map((social, index) => (
              <ScrollReveal key={social.name} delay={index * 0.1}>
                <Link
                  href={social.href}
                  className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-medium transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{social.icon}</div>
                  <h3 className="font-semibold text-primary mb-2">{social.name}</h3>
                  <p className="text-text-light text-sm">{social.followers}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
