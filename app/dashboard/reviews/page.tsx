'use client'

import { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'
import Modal from '@/components/Modal'
import Pagination from '@/components/Pagination'

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  location: string | null
  avatar: string | null
  visible: boolean
  featured: boolean
  order: number
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showModal, setShowModal] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    location: '',
    avatar: '',
    visible: true,
    featured: false,
    order: 0,
  })
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchReviews()
  }, [])

  const totalPages = Math.ceil(reviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = reviews.slice(startIndex, endIndex)

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?visible=false')
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews'
      const method = editingReview ? 'PATCH' : 'POST'

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
          editingReview ? 'Sharh yangilandi' : 'Sharh muvaffaqiyatli yaratildi',
          'success'
        )
        setShowModal(false)
        setFormData({
          customerName: '',
          rating: 5,
          comment: '',
          location: '',
          avatar: '',
          visible: true,
          featured: false,
          order: 0,
        })
        setEditingReview(null)
        fetchReviews()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to save review:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setFormData({
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      location: review.location || '',
      avatar: review.avatar || '',
      visible: review.visible,
      featured: review.featured,
      order: review.order,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Sharhni o'chirishni tasdiqlaysizmi?")) return

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Sharh muvaffaqiyatli o\'chirildi', 'success')
        fetchReviews()
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
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
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Sharhlar</h1>
          <p className="text-text-light">Mijoz sharhlarini boshqaring</p>
        </div>
        <button
          onClick={() => {
            setEditingReview(null)
            setFormData({
              customerName: '',
              rating: 5,
              comment: '',
              location: '',
              avatar: '',
              visible: true,
              featured: false,
              order: 0,
            })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi sharh
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-text-light text-lg">Sharhlar topilmadi. Birinchi sharhni qo&apos;shing.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-4">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-lg">
                        {review.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary mb-1 truncate">{review.customerName}</h3>
                    {review.location && (
                      <p className="text-sm text-text-light mb-2 truncate">{review.location}</p>
                    )}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-text-light text-sm mb-4 line-clamp-3 leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {review.featured && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Tanlangan
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        review.visible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {review.visible ? "Ko'rinadi" : "Yashirin"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
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

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingReview(null)
          setFormData({
            customerName: '',
            rating: 5,
            comment: '',
            location: '',
            avatar: '',
            visible: true,
            featured: false,
            order: 0,
          })
        }}
        title={editingReview ? 'Sharhni tahrirlash' : 'Yangi sharh'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-primary font-medium mb-2">Mijoz ismi *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-primary font-medium mb-2">Reyting (1-5) *</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })
                }
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-primary font-medium mb-2">Sharh *</label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-primary font-medium mb-2">Manzil (ixtiyoriy)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-primary font-medium mb-2">Avatar URL (ixtiyoriy)</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-primary border-primary/20 rounded focus:ring-primary"
              />
              <label htmlFor="featured" className="text-primary font-medium">
                Tanlangan
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              {editingReview ? 'Yangilash' : 'Yaratish'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setEditingReview(null)
                setFormData({
                  customerName: '',
                  rating: 5,
                  comment: '',
                  location: '',
                  avatar: '',
                  visible: true,
                  featured: false,
                  order: 0,
                })
              }}
              className="px-6 py-3 border-2 border-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
