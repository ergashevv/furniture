'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, InputNumber, Switch, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Store {
  id: string
  name: string
  address: string
  phone: string | null
  email: string | null
  workingHours: string | null
  latitude: number | null
  longitude: number | null
  order: number
  visible: boolean
  createdAt: string
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores?visible=false')
      const data = await response.json()
      if (data.success) {
        setStores(data.stores)
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      message.error('Filiallarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const url = editingStore ? `/api/stores/${editingStore.id}` : '/api/stores'
      const method = editingStore ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          phone: values.phone || null,
          email: values.email || null,
          workingHours: values.workingHours || null,
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
          order: values.order || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingStore ? 'Filial yangilandi' : 'Filial muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingStore(null)
        form.resetFields()
        fetchStores()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save store:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    form.setFieldsValue({
      name: store.name,
      address: store.address,
      phone: store.phone || '',
      email: store.email || '',
      workingHours: store.workingHours || '',
      latitude: store.latitude?.toString() || '',
      longitude: store.longitude?.toString() || '',
      order: store.order,
      visible: store.visible,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Filialni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/stores/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Filial muvaffaqiyatli o\'chirildi', 'success')
            fetchStores()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete store:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Store> = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Manzil',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
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
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Filiallar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Filiallarni boshqaring</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStore(null)
            form.resetFields()
            setIsModalOpen(true)
          }}
        >
          Yangi filial
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : stores.length === 0 ? (
          <Empty description="Filiallar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={stores}
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
        title={editingStore ? "Filialni tahrirlash" : "Yangi filial"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingStore(null)
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
            <Input placeholder="Filial nomi" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Manzil"
            rules={[{ required: true, message: 'Manzilni kiritish majburiy' }]}
          >
            <Input placeholder="Manzil" />
          </Form.Item>

          <Form.Item name="phone" label="Telefon (ixtiyoriy)">
            <Input placeholder="+998901234567" />
          </Form.Item>

          <Form.Item name="email" label="Email (ixtiyoriy)">
            <Input type="email" placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="workingHours" label="Ish vaqti (ixtiyoriy)">
            <Input placeholder="9:00 - 18:00" />
          </Form.Item>

          <Form.Item name="latitude" label="Kenglik (ixtiyoriy)">
            <Input placeholder="41.3111" />
          </Form.Item>

          <Form.Item name="longitude" label="Uzunlik (ixtiyoriy)">
            <Input placeholder="69.2797" />
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
                {editingStore ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingStore(null)
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
