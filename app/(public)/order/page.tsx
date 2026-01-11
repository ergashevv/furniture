'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ScrollReveal from '@/components/ScrollReveal'
import { useNotification } from '@/components/Notification'

const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  productName: z.string().optional(),
  description: z.string().min(10, 'Please provide more details (at least 10 characters)'),
})

type OrderFormData = z.infer<typeof orderSchema>

interface UploadedFile {
  url: string
  name: string
  type: string
}

export default function OrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { showNotification } = useNotification()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      fileArray.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const newFiles: UploadedFile[] = fileArray.map((file, index) => ({
          url: data.urls[index],
          name: file.name,
          type: file.type,
        }))
        setUploadedFiles((prev) => [...prev, ...newFiles])
      } else {
        const errorData = await response.json()
        console.error('Upload error:', errorData.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeFile = (url: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.url !== url))
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
        showNotification('Buyurtmangiz muvaffaqiyatli qabul qilindi!', 'success', 5000)
        reset()
        setUploadedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error')
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
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Bosh sahifa
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Xarid qilishni davom ettirish
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
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
                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                  } ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isSubmitting || isUploading}
                  />

                  <div className="text-center">
                    {isUploading ? (
                      <>
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-text font-medium">Uploading files...</p>
                      </>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-text font-medium mb-1">
                          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-text-light text-sm">
                          PNG, JPG, PDF up to 10MB (multiple files allowed)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-text mb-3">
                      Uploaded files ({uploadedFiles.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                        >
                          {file.type.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(file.url)
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            type="button"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          <div className="p-2 bg-white">
                            <p className="text-xs text-text truncate" title={file.name}>
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
