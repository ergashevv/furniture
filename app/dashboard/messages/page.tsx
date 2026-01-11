'use client'

import { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'

interface ContactMessage {
  id: string
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      const url =
        filter === 'all'
          ? '/api/contact'
          : filter === 'read'
            ? '/api/contact?read=true'
            : '/api/contact?read=false'
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        showNotification('Xabar o&apos;qildi deb belgilandi', 'success')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true })
        }
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xabarni o\'chirishni tasdiqlaysizmi?')) return

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        showNotification('Xabar muvaffaqiyatli o\'chirildi', 'success')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      } else {
        showNotification('Xatolik yuz berdi', 'error')
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
      showNotification('Xatolik yuz berdi', 'error')
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (isLoading) {
    return <div className="text-text-light">Yuklanmoqda...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Xabarlar</h1>
          <p className="text-text-light">
            {unreadCount > 0 && (
              <span className="text-secondary font-semibold">{unreadCount} yangi xabar</span>
            )}
            {unreadCount === 0 && <span>Barcha xabarlar</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-background-dark text-text hover:bg-primary/10'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f === 'unread' ? 'O&apos;qilmagan' : 'O&apos;qilgan'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`bg-white rounded-xl shadow-soft p-4 cursor-pointer transition-all duration-200 ${
                selectedMessage?.id === message.id
                  ? 'ring-2 ring-primary shadow-medium'
                  : 'hover:shadow-medium'
              } ${!message.read ? 'border-l-4 border-secondary' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-primary text-sm">{message.name}</h3>
                {!message.read && (
                  <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-1"></span>
                )}
              </div>
              {message.subject && (
                <p className="text-text-light text-xs mb-1 line-clamp-1">{message.subject}</p>
              )}
              <p className="text-text-light text-xs line-clamp-2">{message.message}</p>
              <p className="text-text-light/60 text-xs mt-2">
                {new Date(message.createdAt).toLocaleDateString('uz-UZ')}
              </p>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <p className="text-text-light">Xabarlar topilmadi</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">{selectedMessage.name}</h2>
                  <div className="space-y-1 text-sm text-text-light">
                    {selectedMessage.email && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{selectedMessage.email}</span>
                      </div>
                    )}
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{selectedMessage.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(selectedMessage.createdAt).toLocaleString('uz-UZ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!selectedMessage.read && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
                    >
                      O&apos;qildi deb belgilash
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    {"O'chirish"}
                  </button>
                </div>
              </div>

              {selectedMessage.subject && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">Mavzu</h3>
                  <p className="text-text-light">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Xabar</h3>
                <p className="text-text-light whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
              <p className="text-text-light">Xabarni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
