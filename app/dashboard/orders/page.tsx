'use client'

import { useEffect, useState } from 'react'
import { Card, Table, Tag, Space, Select, Button, Modal, Descriptions, message, Spin, Empty, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Order {
  id: string
  customerName: string
  email: string
  phone: string | null
  address: string | null
  productName: string | null
  description: string | null
  designFiles: string[]
  status: string
  notes: string | null
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'orange',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'red',
}

const statusLabels: Record<string, string> = {
  pending: 'Kutilmoqda',
  in_progress: 'Jarayonda',
  completed: 'Tugallangan',
  cancelled: 'Bekor qilingan',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'all' ? '/api/orders' : `/api/orders?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      message.error('Buyurtmalarni yuklashda xatolik')
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
        showNotification('Buyurtma holati yangilandi', 'success')
        fetchOrders()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to update order:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const columns: ColumnsType<Order> = [
    {
      title: 'Mijoz',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Mahsulot',
      dataIndex: 'productName',
      key: 'productName',
      render: (productName: string) => productName || '-',
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value="pending">Kutilmoqda</Select.Option>
          <Select.Option value="in_progress">Jarayonda</Select.Option>
          <Select.Option value="completed">Tugallangan</Select.Option>
          <Select.Option value="cancelled">Bekor qilingan</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
          size="small"
        >
          {"Ko'rish"}
        </Button>
      ),
    },
  ]

  const tabItems = [
    { key: 'all', label: 'Barchasi' },
    { key: 'pending', label: 'Kutilmoqda' },
    { key: 'in_progress', label: 'Jarayonda' },
    { key: 'completed', label: 'Tugallangan' },
    { key: 'cancelled', label: 'Bekor qilingan' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Buyurtmalar</h1>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Buyurtmalarni boshqaring</p>
      </div>

      <Card>
        <Tabs
          activeKey={statusFilter}
          onChange={setStatusFilter}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : orders.length === 0 ? (
          <Empty description="Buyurtmalar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta`,
            }}
          />
        )}
      </Card>

      <Modal
        title="Buyurtma tafsilotlari"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mijoz">{selectedOrder.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedOrder.email}</Descriptions.Item>
            <Descriptions.Item label="Telefon">{selectedOrder.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Manzil">{selectedOrder.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="Mahsulot">{selectedOrder.productName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tavsif">{selectedOrder.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="Holat">
              <Tag color={statusColors[selectedOrder.status]}>
                {statusLabels[selectedOrder.status]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Eslatma">{selectedOrder.notes || '-'}</Descriptions.Item>
            <Descriptions.Item label="Sana">
              {new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}
            </Descriptions.Item>
            {selectedOrder.designFiles.length > 0 && (
              <Descriptions.Item label="Dizayn fayllari">
                <Space direction="vertical">
                  {selectedOrder.designFiles.map((file, index) => (
                    <a key={index} href={file} target="_blank" rel="noopener noreferrer">
                      Fayl {index + 1}
                    </a>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
