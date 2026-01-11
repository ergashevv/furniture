'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substring(7)
      const notification: Notification = { id, message, type, duration }

      setNotifications((prev) => [...prev, notification])

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, duration)
      }
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600'
      case 'error':
        return 'bg-red-500 text-white border-red-600'
      case 'info':
      default:
        return 'bg-primary text-white border-primary/80'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${getNotificationStyles(notification.type)} border rounded-lg shadow-lg px-4 py-3 min-w-[300px] max-w-md pointer-events-auto flex items-center gap-3`}
            >
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>
              <p className="flex-1 text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}