'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useNotification } from '@/components/Notification'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchCategories()
  }, [])

  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCategories = categories.slice(startIndex, endIndex)

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      const method = editingCategory ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showNotification(
          editingCategory
            ? 'Kategoriya yangilandi'
            : 'Kategoriya muvaffaqiyatli yaratildi',
          'success'
        )
        setShowModal(false)
        setFormData({ name: '', slug: '', description: '' })
        setEditingCategory(null)
        fetchCategories()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to save category:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Kategoriyani o\'chirishni tasdiqlaysizmi?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Kategoriya muvaffaqiyatli o\'chirildi', 'success')
        fetchCategories()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  if (isLoading) {
    return <div className="text-text-light">Yuklanmoqda...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Kategoriyalar</h1>
          <p className="text-text-light">Mahsulot kategoriyalarini boshqaring</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', slug: '', description: '' })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi kategoriya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-text-light mb-2">/{category.slug}</p>
                {category.description && (
                  <p className="text-text-light text-sm line-clamp-2">{category.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
              <span className="text-sm text-text-light">
                {category._count?.products || 0} mahsulot
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  {"O'chirish"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">
            Kategoriyalar topilmadi. Birinchi kategoriyani qo&apos;shing.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-primary font-medium mb-2">Nomi</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">Tavsif (ixtiyoriy)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  {editingCategory ? 'Yangilash' : 'Yaratish'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                    setFormData({ name: '', slug: '', description: '' })
                  }}
                  className="px-6 py-3 border-2 border-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
