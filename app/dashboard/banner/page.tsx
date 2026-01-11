'use client'

import React, { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'
import Modal from '@/components/Modal'
import Pagination from '@/components/Pagination'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonText: string | null
  buttonLink: string | null
  overlay: number
  visible: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const bannersPerPage = 10
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    overlay: 0.5,
    visible: true,
    order: 0,
  })
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchBanners()
  }, [])

  const indexOfLastBanner = currentPage * bannersPerPage
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage
  const currentBanners = banners.slice(indexOfFirstBanner, indexOfLastBanner)
  const totalPages = Math.ceil(banners.length / bannersPerPage)

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banner?includeHidden=true')
      const data = await response.json()
      if (data.success) {
        setBanners(data.banners)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBanner ? `/api/banner/${editingBanner.id}` : '/api/banner'
      const method = editingBanner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          buttonText: formData.buttonText || null,
          buttonLink: formData.buttonLink || null,
          overlay: parseFloat(formData.overlay.toString()) || 0.5,
          order: parseInt(formData.order.toString()) || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingBanner ? 'Banner yangilandi' : 'Banner muvaffaqiyatli yaratildi',
          'success'
        )
        setShowModal(false)
        setEditingBanner(null)
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          imageUrl: '',
          buttonText: '',
          buttonLink: '',
          overlay: 0.5,
          visible: true,
          order: 0,
        })
        fetchBanners()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to save banner:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      overlay: banner.overlay,
      visible: banner.visible,
      order: banner.order,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Banner o'chirilishini tasdiqlaysizmi?")) return

    try {
      const response = await fetch(`/api/banner/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showNotification('Banner o\'chirildi', 'success')
        fetchBanners()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete banner:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-light">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">Banner</h1>
        <button
          onClick={() => {
            setEditingBanner(null)
            setFormData({
              title: '',
              subtitle: '',
              description: '',
              imageUrl: '',
              buttonText: '',
              buttonLink: '',
              overlay: 0.5,
              visible: true,
              order: 0,
            })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center text-text-light">
          Bannerlar topilmadi. Birinchi bannerni qo&apos;shing.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200"
              >
                <div className="aspect-video bg-background-dark relative">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {!banner.visible && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                        Yashirin
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary text-lg mb-1 line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-sm text-text-light mb-2 line-clamp-1">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        banner.visible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.visible ? "Ko'rinadi" : 'Yashirin'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs font-medium"
                      >
                        Tahrir
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                      >
                        {"O'chirish"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingBanner(null)
          setFormData({
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            buttonText: '',
            buttonLink: '',
            overlay: 0.5,
            visible: true,
            order: 0,
          })
        }}
        title={editingBanner ? "Bannerni tahrirlash" : "Yangi banner"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sarlavha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
              placeholder="Banner sarlavhasi"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pastki sarlavha</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
              placeholder="Pastki sarlavha (ixtiyoriy)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tavsif</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white text-gray-900"
              placeholder="Banner tavsifi (ixtiyoriy)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rasm URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tugma matni</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
                placeholder="Ko'proq ko'rish"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tugma linki</label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
                placeholder="/order"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Overlay (0-1)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.overlay}
                onChange={(e) => setFormData({ ...formData, overlay: parseFloat(e.target.value) || 0.5 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tartib</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">{"Ko'rinadi"}</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
            >
              {editingBanner ? 'Yangilash' : 'Yaratish'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setEditingBanner(null)
                setFormData({
                  title: '',
                  subtitle: '',
                  description: '',
                  imageUrl: '',
                  buttonText: '',
                  buttonLink: '',
                  overlay: 0.5,
                  visible: true,
                  order: 0,
                })
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
