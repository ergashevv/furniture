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

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-dark">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-background-dark/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-text">{product.name}</div>
                  <div className="text-sm text-text-light">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-text">
                  {product.price ? `$${product.price.toLocaleString()}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.visible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.visible ? 'Visible' : 'Hidden'}
                  </span>
                  {product.featured && (
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-secondary hover:text-secondary-dark text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-text-light">
            No products found. Add your first product to get started.
          </div>
        )}
      </div>
    </div>
  )
}
