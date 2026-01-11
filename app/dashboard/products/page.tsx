'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useNotification } from '@/components/Notification'
import Pagination from '@/components/Pagination'

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
    if (!window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-light">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Mahsulotlar</h1>
          <p className="text-text-light">Mahsulotlarni boshqaring</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi mahsulot
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">Mahsulotlar topilmadi. Birinchi mahsulotni qo&apos;shing.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
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
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Tanlangan
                      </span>
                    </div>
                  )}
                  {!product.visible && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
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
                      {product.price ? `${product.price.toLocaleString()} so'm` : "Narx yo'q"}
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          )}
        </>
      )}
    </div>
  )
}
