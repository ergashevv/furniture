'use client'

import { useEffect, useState } from 'react'

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
    { label: 'Total Orders', value: stats.orders, color: 'bg-primary' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-secondary' },
    { label: 'Products', value: stats.products, color: 'bg-primary' },
    { label: 'Gallery Items', value: stats.galleryItems, color: 'bg-secondary' },
  ]

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-primary mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} text-white rounded-2xl p-6 shadow-soft`}
          >
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-soft">
        <h2 className="text-2xl font-serif font-semibold text-primary mb-4">
          Welcome to the Dashboard
        </h2>
        <p className="text-text-light">
          Use the navigation above to manage products, orders, gallery items, and settings.
        </p>
      </div>
    </div>
  )
}
