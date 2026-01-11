'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ScrollReveal from '@/components/ScrollReveal'

const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  productName: z.string().optional(),
  description: z.string().min(10, 'Please provide more details (at least 10 characters)'),
})

type OrderFormData = z.infer<typeof orderSchema>

export default function OrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedFiles((prev) => [...prev, ...data.urls])
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          designFiles: uploadedFiles,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
        setUploadedFiles([])
      }
    } catch (error) {
      console.error('Order submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      number: '01',
      title: 'Tell Us About Your Project',
      description: 'Share your vision and requirements',
    },
    {
      number: '02',
      title: 'Upload Design Files',
      description: 'Share any sketches, photos, or references',
    },
    {
      number: '03',
      title: 'Consultation',
      description: 'We review and discuss your project',
    },
    {
      number: '04',
      title: 'Quote & Approval',
      description: 'Receive a detailed quote and timeline',
    },
  ]

  if (submitSuccess) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-12 shadow-medium">
            <div className="text-6xl mb-6">✓</div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Order Submitted Successfully!
            </h1>
            <p className="text-text-light mb-8">
              Thank you for your order. We&apos;ve received your request and will contact you
              within 24 hours to discuss your project in detail.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              Submit Another Order
            </button>
          </div>
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Start Your Order
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Let&apos;s bring your vision to life. Fill out the form below to get started.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 px-4 border-b border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-secondary/30 mb-2">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-primary mb-1">{step.title}</h3>
                  <p className="text-sm text-text-light">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-soft space-y-6">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                  Your Information
                </h2>

                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-text mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('customerName')}
                    type="text"
                    id="customerName"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="John Doe"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-text mb-2">
                    Address
                  </label>
                  <textarea
                    {...register('address')}
                    id="address"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                    placeholder="Your address for delivery"
                  />
                </div>

                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-text mb-2">
                    Product Name (if applicable)
                  </label>
                  <input
                    {...register('productName')}
                    type="text"
                    id="productName"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="e.g., Custom Dining Table"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
                    Project Description *
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                    placeholder="Tell us about your project, dimensions, materials, style preferences, timeline, and any other relevant details..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                  Design Files (Optional)
                </h2>
                <p className="text-text-light mb-4 text-sm">
                  Upload sketches, photos, reference images, or any design files that will help
                  us understand your vision.
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  disabled={isSubmitting}
                />
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-text-light mb-2">
                      Uploaded files: {uploadedFiles.length}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
