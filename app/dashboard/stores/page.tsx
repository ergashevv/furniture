'use client'

import { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'

interface Store {
  id: string
  name: string
  address: string
  phone: string | null
  email: string | null
  workingHours: string | null
  latitude: number | null
  longitude: number | null
  order: number
  visible: boolean
  createdAt: string
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    latitude: '',
    longitude: '',
    order: 0,
    visible: true,
  })
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchStores()
  }, [])

  const totalPages = Math.ceil(stores.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStores = stores.slice(startIndex, endIndex)

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores?visible=false')
      const data = await response.json()
      if (data.success) {
        setStores(data.stores)
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingStore ? `/api/stores/${editingStore.id}` : '/api/stores'
      const method = editingStore ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()) || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingStore ? 'Filial yangilandi' : 'Filial muvaffaqiyatli yaratildi',
          'success'
        )
        setShowModal(false)
        setFormData({
          name: '',
          address: '',
          phone: '',
          email: '',
          workingHours: '',
          latitude: '',
          longitude: '',
          order: 0,
          visible: true,
        })
        setEditingStore(null)
        fetchStores()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to save store:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone || '',
      email: store.email || '',
      workingHours: store.workingHours || '',
      latitude: store.latitude?.toString() || '',
      longitude: store.longitude?.toString() || '',
      order: store.order,
      visible: store.visible,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Filialni o\'chirishni tasdiqlaysizmi?')) return

    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Filial muvaffaqiyatli o\'chirildi', 'success')
        fetchStores()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete store:', error)
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
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Filiallar</h1>
          <p className="text-text-light">Filiallarni boshqaring</p>
        </div>
        <button
          onClick={() => {
            setEditingStore(null)
            setFormData({
              name: '',
              address: '',
              phone: '',
              email: '',
              workingHours: '',
              latitude: '',
              longitude: '',
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
          Yangi filial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary text-lg mb-2">{store.name}</h3>
                <div className="space-y-2 text-sm text-text-light">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{store.address}</span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{store.email}</span>
                    </div>
                  )}
                  {store.workingHours && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{store.workingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  store.visible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {store.visible ? 'Ko&apos;rinadi' : 'Yashirin'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(store)}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  O&apos;chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">Filiallar topilmadi. Birinchi filialni qo&apos;shing.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingStore ? 'Filialni tahrirlash' : 'Yangi filial'}
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
                <label className="block text-primary font-medium mb-2">Manzil</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-medium mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-primary font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">Ish vaqti</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Du-Ju: 09:00 - 19:00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-medium mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-primary font-medium mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
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
                    Ko&apos;rinadi
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  {editingStore ? 'Yangilash' : 'Yaratish'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingStore(null)
                    setFormData({
                      name: '',
                      address: '',
                      phone: '',
                      email: '',
                      workingHours: '',
                      latitude: '',
                      longitude: '',
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
