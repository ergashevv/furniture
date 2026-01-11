'use client'

import { useEffect, useState } from 'react'
import { useNotification } from '@/components/Notification'

interface Order {
  id: string
  customerName: string
  email: string
  phone: string | null
  productName: string | null
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const url =
        statusFilter === 'all' ? '/api/orders' : `/api/orders?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  if (isLoading) {
    return <div className="text-text-light">Loading orders...</div>
  }

  const statusOptions = ['all', 'pending', 'in_progress', 'completed', 'cancelled']

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">Orders</h1>
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-background-dark text-text hover:bg-primary/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-dark">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-background-dark/50">
                <td className="px-6 py-4 font-medium text-text">{order.customerName}</td>
                <td className="px-6 py-4 text-text-light">{order.email}</td>
                <td className="px-6 py-4 text-text-light">{order.productName || '—'}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-primary/20 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-text-light text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      // Could open a modal with order details
                      showNotification(`Buyurtma: ${order.customerName} - ${order.productName || 'N/A'}`, 'info')
                    }}
                    className="text-secondary hover:text-secondary-dark text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-text-light">No orders found.</div>
        )}
      </div>
    </div>
  )
}
