'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    galleryItems: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, galleryRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
          fetch('/api/gallery'),
        ])

        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()
        const galleryData = await galleryRes.json()

        const orders = ordersData.orders || []
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length

        setStats({
          orders: orders.length,
          products: (productsData.products || []).length,
          galleryItems: (galleryData.items || []).length,
          pendingOrders,
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
      )
    },
    { 
      label: 'Kutilayotgan', 
      value: stats.pendingOrders, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Mahsulotlar', 
      value: stats.products, 
      color: 'bg-gradient-to-br from-primary to-primary-dark',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      label: 'Galereya', 
      value: stats.galleryItems, 
      color: 'bg-gradient-to-br from-secondary to-secondary-dark',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
  ]

  const quickActions = [
    { href: '/dashboard/products/new', label: 'Yangi mahsulot', icon: '➕', color: 'bg-primary' },
    { href: '/dashboard/gallery', label: 'Galereya qo&apos;shish', icon: '🖼️', color: 'bg-secondary' },
    { href: '/dashboard/orders?status=pending', label: 'Buyurtmalar', icon: '📦', color: 'bg-blue-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-text-light">Boshqaruv paneliga xush kelibsiz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="opacity-80">{stat.icon}</div>
            </div>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-white/90 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Tezkor amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
