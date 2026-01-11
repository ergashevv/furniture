'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const router = useRouter()

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl font-serif font-bold text-primary mb-4">Savatcha</h1>
              <p className="text-text-light mb-8">0 ta mahsulot</p>
              <div className="bg-white rounded-2xl p-12 shadow-soft max-w-md mx-auto">
                <div className="w-24 h-24 bg-background-dark rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-text-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                  Savatchingiz bo&apos;sh
                </h2>
                <p className="text-text-light mb-8">
                  Mahsulotlarni ko&apos;rib chiqing va savatchaga qo&apos;shing
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Xarid qilish
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ScrollReveal>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Savatcha</h1>
          <p className="text-text-light mb-8">{cartItems.length} ta mahsulot</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <ScrollReveal key={item.id} delay={0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-24 h-24 bg-background-dark rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-xl font-serif font-semibold text-primary mb-2 hover:text-secondary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-primary font-bold text-lg mb-2">
                            {item.price.toLocaleString()} so&apos;m
                          </p>
                          <p className="text-text-light text-sm">
                            Jami: {(item.price * item.quantity).toLocaleString()} so&apos;m
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-primary/20 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 text-primary font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Savatchani tozalash
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                  Buyurtma xulosasi
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-text-light">
                    <span>Mahsulotlar ({cartItems.length})</span>
                    <span className="font-medium text-primary">{totalPrice.toLocaleString()} so&apos;m</span>
                  </div>
                  <div className="flex justify-between text-text-light">
                    <span>Yetkazib berish</span>
                    <span className="text-green-600 font-medium">BEPUL</span>
                  </div>
                  <div className="border-t border-primary/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-primary">Jami:</span>
                      <span className="text-lg font-bold text-primary">
                        {totalPrice.toLocaleString()} so&apos;m
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-primary text-white py-4 rounded-lg hover:bg-secondary transition-colors font-semibold mb-4"
                >
                  Buyurtma berish
                </button>
                <Link
                  href="/products"
                  className="block text-center text-primary hover:text-secondary transition-colors font-medium text-sm"
                >
                  Xarid qilishni davom ettirish
                </Link>
                <p className="mt-4 text-xs text-text-light text-center">
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
