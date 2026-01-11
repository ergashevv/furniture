'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, InputNumber, Switch, Avatar, Rate, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

const { Search } = Input

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reviews?visible=false')
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      message.error('Sharhlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReviews = useMemo(() => {
    if (!searchText.trim()) return reviews
    const searchLower = searchText.toLowerCase()
    return reviews.filter(
      (review) =>
        review.customerName.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower) ||
        (review.location && review.location.toLowerCase().includes(searchLower))
    )
  }, [reviews, searchText])

  const handleSubmit = async (values: any) => {
    try {
      const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews'
      const method = editingReview ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          location: values.location || null,
          avatar: values.avatar || null,
          order: values.order || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingReview ? 'Sharh yangilandi' : 'Sharh muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingReview(null)
        form.resetFields()
        fetchReviews()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save review:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    form.setFieldsValue({
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      location: review.location || '',
      avatar: review.avatar || '',
      visible: review.visible,
      featured: review.featured,
      order: review.order,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Sharhni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/reviews/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Sharh muvaffaqiyatli o\'chirildi', 'success')
            fetchReviews()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete review:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Review> = [
    {
      title: 'Mijoz',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} size="large">
            {record.customerName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.customerName}</div>
            {record.location && (
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.location}</div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Reyting',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Sharh',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Holat',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {record.featured && <Tag color="gold">Tanlangan</Tag>}
          <Tag color={record.visible ? 'green' : 'default'}>
            {record.visible ? "Ko'rinadi" : 'Yashirin'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
            {"O'chirish"}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Sharhlar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Mijoz sharhlarini boshqaring</p>
        </div>
        <Space>
          <Search
            placeholder="Qidirish..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingReview(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
          >
            Yangi sharh
          </Button>
        </Space>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <Empty description={searchText ? "Qidiruv natijalari topilmadi" : "Sharhlar topilmadi"} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredReviews}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta`,
            }}
          />
        )}
      </Card>

      <Modal
        title={editingReview ? "Sharhni tahrirlash" : "Yangi sharh"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingReview(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rating: 5,
            visible: true,
            featured: false,
            order: 0,
          }}
        >
          <Form.Item
            name="customerName"
            label="Mijoz ismi"
            rules={[{ required: true, message: 'Mijoz ismini kiritish majburiy' }]}
          >
            <Input placeholder="Mijoz ismi" />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Reyting (1-5)"
            rules={[{ required: true, message: 'Reytingni kiritish majburiy' }]}
          >
            <InputNumber min={1} max={5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Sharh"
            rules={[{ required: true, message: 'Sharhni kiritish majburiy' }]}
          >
            <Input.TextArea rows={4} placeholder="Sharh matni" />
          </Form.Item>

          <Form.Item name="location" label="Manzil (ixtiyoriy)">
            <Input placeholder="Manzil" />
          </Form.Item>

          <Form.Item name="avatar" label="Avatar URL (ixtiyoriy)">
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item name="order" label="Tartib">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="visible" valuePropName="checked" label="Ko'rinadi">
            <Switch />
          </Form.Item>

          <Form.Item name="featured" valuePropName="checked" label="Tanlangan">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingReview ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingReview(null)
                  form.resetFields()
                }}
              >
                Bekor qilish
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
