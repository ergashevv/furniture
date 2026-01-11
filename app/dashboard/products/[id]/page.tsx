'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  originalPrice: number | null
  imageUrl: string | null
  images: string[]
  categoryId: string | null
  featured: boolean
  visible: boolean
  size: string | null
  material: string | null
  warranty: string | null
  colors: string[]
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    images: '',
    categoryId: '',
    featured: false,
    visible: true,
    size: '',
    material: '',
    warranty: '',
    colors: '',
  })

  useEffect(() => {
    fetchCategories()
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      if (data.success && data.product) {
        const product: Product = data.product
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price ? product.price.toString() : '',
          originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
          imageUrl: product.imageUrl || '',
          images: product.images ? product.images.join(', ') : '',
          categoryId: product.categoryId || '',
          featured: product.featured,
          visible: product.visible,
          size: product.size || '',
          material: product.material || '',
          warranty: product.warranty || '',
          colors: product.colors ? product.colors.join(', ') : '',
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
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          images: formData.images
            ? formData.images.split(',').map((url) => url.trim()).filter(Boolean)
            : [],
          colors: formData.colors
            ? formData.colors.split(',').map((color) => color.trim()).filter(Boolean)
            : [],
          categoryId: formData.categoryId || null,
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
          <h1 className="text-4xl font-serif font-bold text-primary">Mahsulotni tahrirlash</h1>
          <p className="text-text-light mt-2">Mahsulot ma&apos;lumotlarini yangilash</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-text-light hover:text-primary border border-primary/20 rounded-lg hover:border-primary/40 transition-colors"
        >
          ← Orqaga
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Mahsulot nomi *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Tavsif *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Narx ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Eski narx ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              O&apos;lcham
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              placeholder="200×8045"
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="MDF"
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Kafolat
            </label>
            <input
              type="text"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              placeholder="1 yil"
              className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Ranglar (vergul bilan ajratilgan, hex kodlar yoki nomlar)
          </label>
          <input
            type="text"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            placeholder="#000000, #ffffff, qora, oq"
            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Kategoriya
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="">Kategoriyani tanlang</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Asosiy rasm URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Qo&apos;shimcha rasmlar (vergul bilan ajratilgan URL&apos;lar)
          </label>
          <input
            type="text"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-primary border-primary/20 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-primary">Tavsiya etiladi</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="w-5 h-5 text-primary border-primary/20 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-primary">Ko`rinadi</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Yangilanmoqda...' : 'Yangilash'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  )
}
