'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  imageUrl: string | null
  images: string[]
  categoryId: string | null
  featured: boolean
  visible: boolean
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    imageUrl: '',
    images: '',
    categoryId: '',
    featured: false,
    visible: true,
  })

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      if (data.success && data.product) {
        const product = data.product
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price ? product.price.toString() : '',
          imageUrl: product.imageUrl || '',
          images: product.images ? product.images.join(', ') : '',
          categoryId: product.categoryId || '',
          featured: product.featured,
          visible: product.visible,
        })
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: formData.images
            ? formData.images.split(',').map((url) => url.trim()).filter(Boolean)
            : [],
        }),
      })

      if (response.ok) {
        router.push('/dashboard/products')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-text-light">Loading product...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">Edit Product</h1>
        <button
          onClick={() => router.back()}
          className="text-text-light hover:text-text"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Main Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Additional Images (comma-separated URLs)
          </label>
          <input
            type="text"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-text">Featured</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-text">Visible</span>
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-background-dark text-text px-6 py-3 rounded-full font-semibold hover:bg-background transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
