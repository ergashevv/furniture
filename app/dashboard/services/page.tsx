'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, InputNumber, Switch, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  price: string | null
  features: string[]
  order: number
  visible: boolean
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?visible=false')
      const data = await response.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
      message.error('Xizmatlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services'
      const method = editingService ? 'PATCH' : 'POST'

      const featuresArray = values.features
        ? values.features.split('\n').filter((f: string) => f.trim())
        : []

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          icon: values.icon || null,
          price: values.price || null,
          features: featuresArray,
          order: values.order || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingService ? 'Xizmat yangilandi' : 'Xizmat muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingService(null)
        form.resetFields()
        fetchServices()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save service:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    form.setFieldsValue({
      name: service.name,
      slug: service.slug,
      description: service.description,
      icon: service.icon || '',
      price: service.price || '',
      features: service.features.join('\n'),
      order: service.order,
      visible: service.visible,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xizmatni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/services/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Xizmat muvaffaqiyatli o\'chirildi', 'success')
            fetchServices()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete service:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Service> = [
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
      title: 'Narx',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => price || '-',
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
      dataIndex: 'visible',
      key: 'visible',
      width: 100,
      render: (visible: boolean) => (
        <Tag color={visible ? 'green' : 'default'}>
          {visible ? 'Ko\'rinadi' : 'Yashirin'}
        </Tag>
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Xizmatlar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Xizmatlarni boshqaring</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingService(null)
            form.resetFields()
            setIsModalOpen(true)
          }}
        >
          Yangi xizmat
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : services.length === 0 ? (
          <Empty description="Xizmatlar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={services}
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
        title={editingService ? "Xizmatni tahrirlash" : "Yangi xizmat"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingService(null)
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
            visible: true,
            order: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Nomi"
            rules={[{ required: true, message: 'Nomini kiritish majburiy' }]}
          >
            <Input placeholder="Xizmat nomi" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Slug kiritish majburiy' }]}
          >
            <Input placeholder="xizmat-slug" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: 'Tavsifni kiritish majburiy' }]}
          >
            <Input.TextArea rows={4} placeholder="Xizmat tavsifi" />
          </Form.Item>

          <Form.Item name="icon" label="Icon URL (ixtiyoriy)">
            <Input placeholder="https://example.com/icon.svg" />
          </Form.Item>

          <Form.Item name="price" label="Narx (ixtiyoriy)">
            <Input placeholder="Narx" />
          </Form.Item>

          <Form.Item name="features" label="Xususiyatlar (har birini yangi qatorda)">
            <Input.TextArea rows={4} placeholder="Xususiyat 1&#10;Xususiyat 2&#10;Xususiyat 3" />
          </Form.Item>

          <Form.Item name="order" label="Tartib">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="visible" valuePropName="checked" label="Ko'rinadi">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingService ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingService(null)
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
