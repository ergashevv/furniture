'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Table, Tag, Space, Modal, Form, Input, InputNumber, Switch, Image, message, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonLink: string | null
  buttonText: string | null
  visible: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [form] = Form.useForm()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banner?includeHidden=true')
      const data = await response.json()
      if (data.success) {
        setBanners(data.banners)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      message.error('Bannerlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const url = editingBanner ? `/api/banner/${editingBanner.id}` : '/api/banner'
      const method = editingBanner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          subtitle: values.subtitle || null,
          description: values.description || null,
          buttonLink: values.buttonLink || null,
          buttonText: values.buttonText || null,
          order: values.order || 0,
        }),
      })

      if (response.ok) {
        showNotification(
          editingBanner ? 'Banner yangilandi' : 'Banner muvaffaqiyatli yaratildi',
          'success'
        )
        setIsModalOpen(false)
        setEditingBanner(null)
        form.resetFields()
        fetchBanners()
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to save banner:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    form.setFieldsValue({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      buttonLink: banner.buttonLink || '',
      buttonText: banner.buttonText || '',
      visible: banner.visible,
      order: banner.order,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Banner o'chirilishini tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/banner/${id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            showNotification('Banner o\'chirildi', 'success')
            fetchBanners()
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete banner:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const columns: ColumnsType<Banner> = [
    {
      title: 'Rasm',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="Banner"
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
      title: 'Tugma matni',
      dataIndex: 'buttonText',
      key: 'buttonText',
      render: (text: string) => text || '-',
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
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Bannerlar</h1>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Bannerlarni boshqaring</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBanner(null)
            form.resetFields()
            setIsModalOpen(true)
          }}
        >
          Yangi banner
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : banners.length === 0 ? (
          <Empty description="Bannerlar topilmadi" />
        ) : (
          <Table
            columns={columns}
            dataSource={banners}
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
        title={editingBanner ? "Bannerni tahrirlash" : "Yangi banner"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingBanner(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Sarlavha"
            rules={[{ required: true, message: 'Sarlavha kiritish majburiy' }]}
          >
            <Input placeholder="Banner sarlavhasi" />
          </Form.Item>

          <Form.Item name="subtitle" label="Pastki sarlavha">
            <Input placeholder="Pastki sarlavha (ixtiyoriy)" />
          </Form.Item>

          <Form.Item name="description" label="Tavsif">
            <Input.TextArea rows={3} placeholder="Banner tavsifi (ixtiyoriy)" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Rasm URL"
            rules={[{ required: true, message: 'Rasm URL kiritish majburiy' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item name="buttonText" label="Tugma matni">
            <Input placeholder="Ko'proq ko'rish" />
          </Form.Item>

          <Form.Item name="buttonLink" label="Tugma linki">
            <Input placeholder="/order" />
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
                {editingBanner ? 'Yangilash' : 'Yaratish'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingBanner(null)
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
