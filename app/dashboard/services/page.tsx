'use client'

import { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'
import Modal from '@/components/Modal'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  price: string | null
  features: string[]
  order: number
  visible: boolean
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    price: '',
    features: '',
    order: 0,
    visible: true,
  })
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchServices()
  }, [])

  const totalPages = Math.ceil(services.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = services.slice(startIndex, endIndex)

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?visible=false')
      const data = await response.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services'
      const method = editingService ? 'PATCH' : 'POST'

      const featuresArray = formData.features
        ? formData.features.split('\n').filter((f) => f.trim())
        : []

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: featuresArray,
          order: parseInt(formData.order.toString()) || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingService ? 'Xizmat yangilandi' : 'Xizmat muvaffaqiyatli yaratildi',
          'success'
        )
        setShowModal(false)
        setFormData({
          name: '',
          slug: '',
          description: '',
          icon: '',
          price: '',
          features: '',
          order: 0,
          visible: true,
        })
        setEditingService(null)
        fetchServices()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to save service:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon || '',
      price: service.price || '',
      features: service.features.join('\n'),
      order: service.order,
      visible: service.visible,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xizmatni o\'chirishni tasdiqlaysizmi?')) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Xizmat muvaffaqiyatli o\'chirildi', 'success')
        fetchServices()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
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
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Xizmatlar</h1>
          <p className="text-text-light">Xizmatlarni boshqaring</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null)
            setFormData({
              name: '',
              slug: '',
              description: '',
              icon: '',
              price: '',
              features: '',
              order: 0,
              visible: true,
            })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi xizmat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {service.icon && (
                  <div className="text-3xl mb-2">{service.icon}</div>
                )}
                <h3 className="font-semibold text-primary text-lg mb-1">{service.name}</h3>
                <p className="text-sm text-text-light mb-2">/{service.slug}</p>
                <p className="text-text-light text-sm line-clamp-2 mb-2">{service.description}</p>
                {service.price && (
                  <p className="text-primary font-semibold mb-2">{service.price}</p>
                )}
                {service.features.length > 0 && (
                  <ul className="text-sm text-text-light space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-text-light/60">+{service.features.length - 3} boshqa</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.visible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {service.visible ? "Ko'rinadi" : "Yashirin"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  {'O\'chirish'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">Xizmatlar topilmadi. Birinchi xizmatni qo&apos;shing.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingService ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">Tavsif</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-medium mb-2">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="🎨"
                  />
                </div>
                <div>
                  <label className="block text-primary font-medium mb-2">Narx</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="Boshlang'ich narx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">
                  Xususiyatlar (har birini yangi qatorda)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Xususiyat 1&#10;Xususiyat 2&#10;Xususiyat 3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-medium mb-2">Tartib</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-5 h-5 text-primary border-primary/20 rounded focus:ring-primary"
                  />
                  <label htmlFor="visible" className="text-primary font-medium">
                    {"Ko'rinadi"}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  {editingService ? 'Yangilash' : 'Yaratish'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingService(null)
                    setFormData({
                      name: '',
                      slug: '',
                      description: '',
                      icon: '',
                      price: '',
                      features: '',
                      order: 0,
                      visible: true,
                    })
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
