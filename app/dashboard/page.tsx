'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    galleryItems: 0,
    categories: 0,
    services: 0,
    stores: 0,
    reviews: 0,
    messages: 0,
    pendingOrders: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          ordersRes,
          productsRes,
          galleryRes,
          categoriesRes,
          servicesRes,
          storesRes,
          reviewsRes,
          messagesRes,
        ] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
          fetch('/api/gallery'),
          fetch('/api/categories'),
          fetch('/api/services?visible=false'),
          fetch('/api/stores?visible=false'),
          fetch('/api/reviews?visible=false'),
          fetch('/api/contact'),
        ])

        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()
        const galleryData = await galleryRes.json()
        const categoriesData = await categoriesRes.json()
        const servicesData = await servicesRes.json()
        const storesData = await storesRes.json()
        const reviewsData = await reviewsRes.json()
        const messagesData = await messagesRes.json()

        const orders = ordersData.orders || []
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
        const unreadMessages = (messagesData.messages || []).filter((m: any) => !m.read).length

        setStats({
          orders: orders.length,
          products: (productsData.products || []).length,
          galleryItems: (galleryData.items || []).length,
          categories: (categoriesData.categories || []).length,
          services: (servicesData.services || []).length,
          stores: (storesData.stores || []).length,
          reviews: (reviewsData.reviews || []).length,
          messages: (messagesData.messages || []).length,
          pendingOrders,
          unreadMessages,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { 
      label: 'Jami Buyurtmalar', 
      value: stats.orders, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: '/dashboard/orders'
    },
    { 
      label: 'Kutilayotgan', 
      value: stats.pendingOrders, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/dashboard/orders?status=pending'
    },
    { 
      label: 'Mahsulotlar', 
      value: stats.products, 
      color: 'bg-gradient-to-br from-primary to-primary-dark',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: '/dashboard/products'
    },
    { 
      label: 'Kategoriyalar', 
      value: stats.categories, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      href: '/dashboard/categories'
    },
    { 
      label: 'Galereya', 
      value: stats.galleryItems, 
      color: 'bg-gradient-to-br from-secondary to-secondary-dark',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard/gallery'
    },
    { 
      label: 'Xizmatlar', 
      value: stats.services, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard/services'
    },
    { 
      label: 'Filiallar', 
      value: stats.stores, 
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/dashboard/stores'
    },
    { 
      label: 'Sharhlar', 
      value: stats.reviews, 
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      href: '/dashboard/reviews'
    },
    { 
      label: 'Xabarlar', 
      value: stats.messages, 
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard/messages',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined
    },
  ]

  const quickActions = [
    { href: '/dashboard/products/new', label: 'Yangi mahsulot', icon: '➕', color: 'bg-primary' },
    { href: '/dashboard/categories', label: 'Kategoriya qo&apos;shish', icon: '🏷️', color: 'bg-purple-500' },
    { href: '/dashboard/gallery', label: 'Galereya qo&apos;shish', icon: '🖼️', color: 'bg-secondary' },
    { href: '/dashboard/services', label: 'Xizmat qo&apos;shish', icon: '⚙️', color: 'bg-green-500' },
    { href: '/dashboard/orders?status=pending', label: 'Buyurtmalar', icon: '📦', color: 'bg-blue-500' },
    { href: '/dashboard/messages', label: 'Xabarlar', icon: '💬', color: 'bg-teal-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-text-light">Boshqaruv paneliga xush kelibsiz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href || '#'}
            className={`${stat.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="opacity-80">{stat.icon}</div>
              {stat.badge && (
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {stat.badge} yangi
                </span>
              )}
            </div>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-white/90 text-sm font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Tezkor amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
        <h2 className="text-2xl font-semibold text-primary mb-3">
          Xush kelibsiz!
        </h2>
        <p className="text-text-light leading-relaxed">
          Bu yerdan mahsulotlar, buyurtmalar, galereya va sozlamalarni boshqarishingiz mumkin. 
          Tezkor amallar panelidan foydalanib, yangi elementlar qo&apos;shish yoki mavjudlarini tahrirlash mumkin.
        </p>
      </div>
    </div>
  )
}
