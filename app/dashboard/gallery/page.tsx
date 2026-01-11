'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, InputNumber, Switch, Image, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

const { Search } = Input

interface GalleryItem {
  id: string
  title: string
  description: string | null
  imageUrl: string
  videoUrl: string | null
  category: string | null
  featured: boolean
  visible: boolean
  order: number
  createdAt: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to fetch gallery items:', error)
      message.error('Galereya elementlarini yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items
    const searchLower = searchText.toLowerCase()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.category && item.category.toLowerCase().includes(searchLower))
    )
  }, [items, searchText])

  const handleSubmit = async (values: any) => {
    try {
      const url = editingItem ? `/api/gallery/${editingItem.id}` : '/api/gallery'
      const method = editingItem ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          description: values.description || null,
          videoUrl: values.videoUrl || null,
          category: values.category || null,
          order: values.order || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingItem ? 'Element yangilandi' : 'Element muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingItem(null)
        form.resetFields()
        fetchItems()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    form.setFieldsValue({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl || '',
      category: item.category || '',
      featured: item.featured,
      visible: item.visible,
      order: item.order,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Elementni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Element muvaffaqiyatli o\'chirildi', 'success')
            fetchItems()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete gallery item:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<GalleryItem> = [
    {
      title: 'Rasm',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="Gallery"
          width={100}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Sarlavha',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Kategoriya',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => category || '-',
    },
    {
      title: 'Tartib',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
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
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Galereya</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Galereya elementlarini boshqaring</p>
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
              setEditingItem(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
          >
            Yangi element
          </Button>
        </Space>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Empty description={searchText ? "Qidiruv natijalari topilmadi" : "Elementlar topilmadi"} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredItems}
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
        title={editingItem ? "Elementni tahrirlash" : "Yangi element"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingItem(null)
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
            featured: false,
            visible: true,
            order: 0,
          }}
        >
          <Form.Item
            name="title"
            label="Sarlavha"
            rules={[{ required: true, message: 'Sarlavha kiritish majburiy' }]}
          >
            <Input placeholder="Element sarlavhasi" />
          </Form.Item>

          <Form.Item name="description" label="Tavsif">
            <Input.TextArea rows={4} placeholder="Element tavsifi (ixtiyoriy)" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Rasm URL"
            rules={[{ required: true, message: 'Rasm URL kiritish majburiy' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item name="videoUrl" label="Video URL (ixtiyoriy)">
            <Input placeholder="https://example.com/video.mp4" />
          </Form.Item>

          <Form.Item name="category" label="Kategoriya (ixtiyoriy)">
            <Input placeholder="Kategoriya" />
          </Form.Item>

          <Form.Item name="order" label="Tartib">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="featured" valuePropName="checked" label="Tanlangan">
            <Switch />
          </Form.Item>

          <Form.Item name="visible" valuePropName="checked" label="Ko'rinadi">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingItem(null)
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
