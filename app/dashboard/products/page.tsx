'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Table, Tag, Space, Image, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  imageUrl: string | null
  featured: boolean
  visible: boolean
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      message.error('Mahsulotlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { Modal } = await import('antd')
    Modal.confirm({
      title: "Mahsulotni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Mahsulot muvaffaqiyatli o\'chirildi', 'success')
            fetchProducts()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete product:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Rasm',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url: string | null) => (
        url ? (
          <Image
            src={url}
            alt="Product"
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 80, height: 80, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#bfbfbf' }}>Rasm yo'q</span>
          </div>
        )
      ),
    },
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
    },
    {
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number | null) => price ? `${price.toLocaleString()} so'm` : "Narx yo'q",
    },
    {
      title: 'Holat',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {record.featured && <Tag color="gold">Tanlangan</Tag>}
          <Tag color={record.visible ? 'green' : 'default'}>
            {record.visible ? 'Ko\'rinadi' : 'Yashirin'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/products/${record.id}`)}
            size="small"
          >
            Tahrir
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Mahsulotlar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Mahsulotlarni boshqaring</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/dashboard/products/new')}
        >
          Yangi mahsulot
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="Mahsulotlar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta`,
            }}
          />
        )}
      </Card>
    </div>
  )
}
