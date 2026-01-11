'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'
import { useNotification } from '@/components/Notification'

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Ism kamida 2 ta belgi bo\'lishi kerak'),
  email: z.string().email('To\'g\'ri email manzil kiriting').min(1, 'Email manzil kiritilishi kerak'),
  phone: z.string().min(9, 'Telefon raqami to\'liq kiritilishi kerak'),
  address: z.string().min(5, 'Manzil kamida 5 ta belgi bo\'lishi kerak'),
  paymentMethod: z.enum(['cash', 'card'], {
    required_error: 'To\'lov usulini tanlang',
  }),
  comment: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showNotification } = useNotification()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cash',
    },
  })

  const paymentMethod = watch('paymentMethod')

  // Redirect to cart if empty


  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderData = {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        productName: cartItems.map((item) => `${item.name} x${item.quantity}`).join(', '),
        description: `To'lov usuli: ${data.paymentMethod === 'cash' ? 'Naqd pul' : 'Plastik karta'}${
          data.comment ? `\nQo'shimcha izoh: ${data.comment}` : ''
        }`,
        designFiles: [],
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart()
        showNotification('Buyurtma muvaffaqiyatli qabul qilindi!', 'success')
        router.push('/checkout/success')
      } else {
        const result = await response.json()
        showNotification(result.error || 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          href="/cart"
          className="inline-flex items-center text-primary hover:text-secondary transition-colors mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Savatchaga qaytish
        </Link>

        <ScrollReveal>
          <h1 className="text-4xl font-serif font-bold text-primary mb-12">Buyurtma berish</h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-primary">
                    Shaxsiy ma&apos;lumotlar
                  </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="customerName" className="block text-primary font-medium mb-2">
                      Ismingiz *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      {...register('customerName')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="To'liq ismingizni kiriting"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-red-500 text-sm">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-primary font-medium mb-2">
                      Email manzil *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-primary font-medium mb-2">
                      Telefon raqam *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="+998 __ ___ __ __"
                      defaultValue="+998 90 123 45 67"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-primary font-medium mb-2">
                      Manzil *
                    </label>
                    <input
                      type="text"
                      id="address"
                      {...register('address')}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="Shahar, tuman, ko'cha, uy raqami"
                    />
                    {errors.address && (
                      <p className="mt-1 text-red-500 text-sm">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-primary font-medium mb-2">
                      Qo&apos;shimcha izoh
                    </label>
                    <textarea
                      id="comment"
                      {...register('comment')}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors bg-background resize-none"
                      placeholder="Ixtiyoriy: qo'shimcha ma'lumotlar"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t border-primary/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-primary">
                        To&apos;lov usuli
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-background">
                        <input
                          type="radio"
                          value="cash"
                          {...register('paymentMethod')}
                          className="mt-1 mr-4 w-5 h-5 text-primary"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              💵
                            </div>
                            <div>
                              <div className="font-semibold text-primary">Naqd pul</div>
                              <div className="text-sm text-text-light">Yetkazib berishda to&apos;lash</div>
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-background">
                        <input
                          type="radio"
                          value="card"
                          {...register('paymentMethod')}
                          className="mt-1 mr-4 w-5 h-5 text-primary"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              💳
                            </div>
                            <div>
                              <div className="font-semibold text-primary">Plastik karta</div>
                              <div className="text-sm text-text-light">Payme, Click, Uzum Bank</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <p className="mt-2 text-red-500 text-sm">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  {/* Submit button will be in order summary */}
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Buyurtma</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-background-dark rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-light">{item.quantity} dona</p>
                        <p className="text-sm font-semibold text-primary">
                          {item.price.toLocaleString()} so`m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 pt-4 border-t border-primary/10">
                  <div className="flex justify-between text-text-light">
                    <span>Mahsulotlar ({cartItems.length})</span>
                    <span className="font-medium text-primary">{totalPrice.toLocaleString()} so`m</span>
                  </div>
                  <div className="flex justify-between text-text-light">
                    <span>Yetkazib berish</span>
                    <span className="text-green-600 font-medium">Bepul</span>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-primary">Jami:</span>
                      <span className="text-lg font-bold text-primary">
                        {totalPrice.toLocaleString()} so`m
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-lg hover:bg-secondary transition-colors font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Buyurtmani tasdiqlash
                    </>
                  )}
                </button>
                <p className="text-xs text-text-light text-center">
                  Buyurtma berishda siz shartlarga rozilik bildirasiz
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
