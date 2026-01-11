'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Tag, Space, Modal, Button, Descriptions, Tabs, message, Spin, Empty, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, DeleteOutlined, CheckOutlined, SearchOutlined } from '@ant-design/icons'
import { useNotification } from '@/components/Notification'

const { Search } = Input

interface ContactMessage {
  id: string
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [searchText, setSearchText] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    setIsLoading(true)
    setIsFiltering(true)
    try {
      const url =
        filter === 'all'
          ? '/api/contact'
          : filter === 'read'
            ? '/api/contact?read=true'
            : '/api/contact?read=false'
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      message.error('Xabarlarni yuklashda xatolik')
    } finally {
      setIsLoading(false)
      setIsFiltering(false)
    }
  }

  const filteredMessages = useMemo(() => {
    if (!searchText.trim()) return messages
    const searchLower = searchText.toLowerCase()
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchLower) ||
        (msg.email && msg.email.toLowerCase().includes(searchLower)) ||
        (msg.phone && msg.phone.toLowerCase().includes(searchLower)) ||
        (msg.subject && msg.subject.toLowerCase().includes(searchLower)) ||
        msg.message.toLowerCase().includes(searchLower)
    )
  }, [messages, searchText])

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        showNotification('Xabar o\'qildi deb belgilandi', 'success')
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true })
        }
      } else {
        message.error('Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
      message.error('Xatolik yuz berdi')
    }
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xabarni o'chirishni tasdiqlaysizmi?",
      okText: "Ha",
      okType: 'danger',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await fetch(`/api/contact/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            showNotification('Xabar muvaffaqiyatli o\'chirildi', 'success')
            fetchMessages()
            if (selectedMessage?.id === id) {
              setIsModalOpen(false)
              setSelectedMessage(null)
            }
          } else {
            message.error('Xatolik yuz berdi')
          }
        } catch (error) {
          console.error('Failed to delete message:', error)
          message.error('Xatolik yuz berdi')
        }
      },
    })
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
    if (!message.read) {
      handleMarkAsRead(message.id)
    }
  }

  const handleTabChange = (key: string) => {
    setFilter(key as 'all' | 'read' | 'unread')
  }

  const columns: ColumnsType<ContactMessage> = [
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Mavzu',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => subject || '-',
      ellipsis: true,
    },
    {
      title: 'Xabar',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Holat',
      dataIndex: 'read',
      key: 'read',
      width: 100,
      render: (read: boolean) => (
        <Tag color={read ? 'default' : 'blue'}>
          {read ? 'O\'qilgan' : 'O\'qilmagan'}
        </Tag>
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
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewMessage(record)}
            size="small"
          >
            {"Ko'rish"}
          </Button>
          {!record.read && (
            <Button
              icon={<CheckOutlined />}
              onClick={() => handleMarkAsRead(record.id)}
              size="small"
            >
              {"O'qildi"}
            </Button>
          )}
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

  const tabItems = [
    { key: 'all', label: 'Barchasi' },
    { key: 'unread', label: 'O\'qilmagan' },
    { key: 'read', label: 'O\'qilgan' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Xabarlar</h1>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Xabarlarni boshqaring</p>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs
            activeKey={filter}
            onChange={handleTabChange}
            items={tabItems}
            style={{ flex: 1 }}
          />
          <Search
            placeholder="Qidirish..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>
        {isLoading || isFiltering ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip={isFiltering ? "Filtrlash..." : "Yuklanmoqda..."} />
          </div>
        ) : filteredMessages.length === 0 ? (
          <Empty description={searchText ? "Qidiruv natijalari topilmadi" : "Xabarlar topilmadi"} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMessages}
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
        title="Xabar tafsilotlari"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setSelectedMessage(null)
        }}
        footer={null}
        width={800}
      >
        {selectedMessage && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Ism">{selectedMessage.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedMessage.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="Telefon">{selectedMessage.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Mavzu">{selectedMessage.subject || '-'}</Descriptions.Item>
            <Descriptions.Item label="Xabar">{selectedMessage.message}</Descriptions.Item>
            <Descriptions.Item label="Holat">
              <Tag color={selectedMessage.read ? 'default' : 'blue'}>
                {selectedMessage.read ? 'O\'qilgan' : 'O\'qilmagan'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sana">
              {new Date(selectedMessage.createdAt).toLocaleString('uz-UZ')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
