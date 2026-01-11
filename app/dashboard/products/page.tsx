'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useNotification } from '@/components/Notification'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  imageUrl: string | null
  featured: boolean
  visible: boolean
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Mahsulot muvaffaqiyatli o\'chirildi', 'success')
        fetchProducts()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  if (isLoading) {
    return <div className="text-text-light">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">Mahsulotlar topilmadi. Birinchi mahsulotni qo&apos;shing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="aspect-square bg-background-dark relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-text-light/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-white">
                      Yangi
                    </span>
                  </div>
                )}
                {!product.visible && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">
                      Yashirin
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-semibold text-primary text-lg mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-text-light mb-3 line-clamp-1">{product.slug}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-primary">
                    {product.price ? `${product.price.toLocaleString()} so&apos;m` : 'Narx belgilanmagan'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-primary/10">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="flex-1 bg-primary text-white text-center px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                  >
                    Tahrirlash
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    O&apos;chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
