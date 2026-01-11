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
    name: 'Telefon',
    value: '+998 90 123 45 67',
    href: 'tel:+998901234567',
    bgColor: 'bg-primary',
  },
  {
    name: 'Telegram',
    value: '@furniglass',
    href: 'https://t.me/furniglass',
    bgColor: 'bg-blue-500',
  },
  {
    name: 'WhatsApp',
    value: '+998 90 123 45 67',
    href: 'https://wa.me/998901234567',
    bgColor: 'bg-green-500',
  },
  {
    name: 'Email',
    value: 'info@furniglass.uz',
    href: 'mailto:info@furniglass.uz',
    bgColor: 'bg-primary',
  },
]

const getContactIcon = (name: string) => {
  switch (name) {
    case 'Telefon':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      )
    case 'Telegram':
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    case 'WhatsApp':
      return (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    case 'Email':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )
    default:
      return null
  }
}

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
                  <div className={`w-16 h-16 ${method.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 text-white`}>
                    {getContactIcon(method.name)}
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

                  <div className="flex items-center justify-center gap-6 text-sm text-text-light">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      15 daqiqada javob
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Ma&apos;lumotlar himoyada
                    </span>
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
              { name: 'Instagram', followers: '15K+', href: '#' },
              { name: 'Telegram', followers: '10K+', href: '#' },
              { name: 'Facebook', followers: '8K+', href: '#' },
              { name: 'YouTube', followers: '5K+', href: '#' },
            ].map((social, index) => {
              const getSocialIcon = (name: string) => {
                switch (name) {
                  case 'Instagram':
                    return (
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )
                  case 'Telegram':
                    return (
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    )
                  case 'Facebook':
                    return (
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )
                  case 'YouTube':
                    return (
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )
                  default:
                    return null
                }
              }
              return (
                <ScrollReveal key={social.name} delay={index * 0.1}>
                  <Link
                    href={social.href}
                    className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-medium transition-shadow duration-300 group"
                  >
                    <div className="flex justify-center mb-4 text-primary group-hover:text-secondary transition-colors">
                      {getSocialIcon(social.name)}
                    </div>
                    <h3 className="font-semibold text-primary mb-2">{social.name}</h3>
                    <p className="text-text-light text-sm">{social.followers}</p>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
