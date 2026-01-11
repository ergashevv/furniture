'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ScrollReveal from '@/components/ScrollReveal'

const interiorDesignSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgi bo\'lishi kerak'),
  phone: z.string().min(9, 'Telefon raqami to\'liq kiritilishi kerak'),
  email: z.string().email('Noto\'g\'ri email manzil').optional().or(z.literal('')),
  roomType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
})

type InteriorDesignFormData = z.infer<typeof interiorDesignSchema>

const roomTypes = [
  { value: 'living', label: 'Zal' },
  { value: 'kitchen', label: 'Oshxona' },
  { value: 'bedroom', label: 'Yotoqxona' },
  { value: 'office', label: 'Ofis' },
  { value: 'outdoor', label: 'Tashqi maydon' },
]

const budgetOptions = [
  { value: 'low', label: '5 000 000 so\'mgacha' },
  { value: 'medium', label: '5 000 000 - 15 000 000 so\'m' },
  { value: 'high', label: '15 000 000+ so\'m' },
]

export default function InteriorDesignPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InteriorDesignFormData>({
    resolver: zodResolver(interiorDesignSchema),
  })

  const onSubmit = async (data: InteriorDesignFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          subject: 'Interyer Dizayn Xizmati',
          message: `Xona turi: ${data.roomType || 'Kiritilmagan'}\nByudjet: ${
            data.budget || 'Kiritilmagan'
          }\nXabar: ${data.message || 'Kiritilmagan'}`,
        }),
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
              Interyer Dizayn Xizmati
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Biz minglab mamnun mijozlarga yordam berdik. Xona dizayni, rang, material va tekstura
              bo&apos;yicha bilimimiz uyingizni o&apos;zgartirishga yordam beradi.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Formani to&apos;ldiring
            </h2>
          </ScrollReveal>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-secondary/20 text-secondary rounded-lg text-center">
              Xabar yuborildi! Tez orada siz bilan bog&apos;lanamiz.
            </div>
          )}

          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-primary font-medium mb-2">
                  Ismingiz *
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
                <label htmlFor="email" className="block text-primary font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="roomType" className="block text-primary font-medium mb-2">
                  Xona turi
                </label>
                <select
                  id="roomType"
                  {...register('roomType')}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                >
                  <option value="">Tanlang</option>
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-primary font-medium mb-2">
                  Byudjet
                </label>
                <select
                  id="budget"
                  {...register('budget')}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                >
                  <option value="">Tanlang</option>
                  {budgetOptions.map((option) => (
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
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors duration-300 font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish →'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
