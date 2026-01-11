'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      message.error('Kategoriyalarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          description: values.description || null,
        }),
      })

      if (response.ok) {
        showNotification(
          editingCategory ? 'Kategoriya yangilandi' : 'Kategoriya muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingCategory(null)
        form.resetFields()
        fetchCategories()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save category:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Kategoriyani o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Kategoriya muvaffaqiyatli o\'chirildi', 'success')
            fetchCategories()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete category:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Category> = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Kategoriyalar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Kategoriyalarni boshqaring</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null)
            form.resetFields()
            setIsModalOpen(true)
          }}
        >
          Yangi kategoriya
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : categories.length === 0 ? (
          <Empty description="Kategoriyalar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={categories}
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
        title={editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nomi"
            rules={[{ required: true, message: 'Nomini kiritish majburiy' }]}
          >
            <Input placeholder="Kategoriya nomi" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Slug kiritish majburiy' }]}
          >
            <Input placeholder="kategoriya-slug" />
          </Form.Item>

          <Form.Item name="description" label="Tavsif">
            <Input.TextArea rows={4} placeholder="Kategoriya tavsifi (ixtiyoriy)" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingCategory(null)
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
