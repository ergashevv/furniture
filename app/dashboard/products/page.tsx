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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchProducts()
  }, [])

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

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
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
          <p className="text-text-light">Mahsulotlar topilmadi. Birinchi mahsulotni qo&apos;shing.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200"
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
                      className="w-10 h-10 text-text-light/30"
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
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-white">
                      Yangi
                    </span>
                  </div>
                )}
                {!product.visible && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500 text-white">
                      Yashirin
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-primary text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-text-light mb-2 line-clamp-1">{product.slug}</p>
                
                <div className="mb-3">
                  <div className="text-sm font-bold text-primary">
                    {product.price ? `${product.price.toLocaleString()} so`m` : 'Narx yok'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="flex-1 bg-primary text-white text-center px-2 py-1.5 rounded-lg hover:bg-primary-dark transition-colors text-xs font-medium"
                  >
                    Tahrirlash
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-2 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    {"O'chirish"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Oldingi
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-primary/20 text-primary hover:bg-primary/5'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-text-light">...</span>
                }
                return null
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Keyingi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
