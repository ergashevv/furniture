'use client'

import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Spin, Space } from 'antd'
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  StarOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

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
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Jami Buyurtmalar',
      value: stats.orders,
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      onClick: () => router.push('/dashboard/orders'),
      color: '#1890ff',
    },
    {
      title: 'Kutilayotgan',
      value: stats.pendingOrders,
      icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      onClick: () => router.push('/dashboard/orders?status=pending'),
      color: '#faad14',
    },
    {
      title: 'Mahsulotlar',
      value: stats.products,
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1a472a' }} />,
      onClick: () => router.push('/dashboard/products'),
      color: '#1a472a',
    },
    {
      title: 'Kategoriyalar',
      value: stats.categories,
      icon: <AppstoreOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      onClick: () => router.push('/dashboard/categories'),
      color: '#722ed1',
    },
    {
      title: 'Galereya',
      value: stats.galleryItems,
      icon: <PictureOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
      onClick: () => router.push('/dashboard/gallery'),
      color: '#eb2f96',
    },
    {
      title: 'Xizmatlar',
      value: stats.services,
      icon: <CustomerServiceOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      onClick: () => router.push('/dashboard/services'),
      color: '#52c41a',
    },
    {
      title: 'Filiallar',
      value: stats.stores,
      icon: <ShopOutlined style={{ fontSize: 32, color: '#2f54eb' }} />,
      onClick: () => router.push('/dashboard/stores'),
      color: '#2f54eb',
    },
    {
      title: 'Sharhlar',
      value: stats.reviews,
      icon: <StarOutlined style={{ fontSize: 32, color: '#f5222d' }} />,
      onClick: () => router.push('/dashboard/reviews'),
      color: '#f5222d',
    },
    {
      title: 'Xabarlar',
      value: stats.messages,
      icon: <MessageOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
      onClick: () => router.push('/dashboard/messages'),
      color: '#13c2c2',
    },
    {
      title: 'O\'qilmagan',
      value: stats.unreadMessages,
      icon: <MailOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      onClick: () => router.push('/dashboard/messages'),
      color: '#fa8c16',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Bosh sahifa</h1>
        <p style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 16 }}>
          Dashboard statistikasi
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={index}>
            <Card
              hoverable
              onClick={card.onClick}
              style={{ cursor: 'pointer', height: '100%' }}
            >
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
