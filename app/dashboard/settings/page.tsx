'use client'

import { useState, useEffect } from 'react'
import { Card, Typography, Space, Divider, Input, Button, message } from 'antd'
import { DatabaseOutlined, CloudServerOutlined, EnvironmentOutlined, DollarOutlined, SaveOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

export default function SettingsPage() {
  const [currencyRate, setCurrencyRate] = useState<string>('13000')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings?key=currencyRate')
        const data = await response.json()
        if (data.success && data.setting) {
          setCurrencyRate(data.setting.value)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchSettings()
  }, [])

  const handleSaveCurrencyRate = async () => {
    const rate = parseFloat(currencyRate)
    if (isNaN(rate) || rate <= 0) {
      message.error('To\'g\'ri valyuta kursini kiriting')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'currencyRate',
          value: currencyRate,
        }),
      })

      const data = await response.json()
      if (data.success) {
        message.success('Valyuta kursi muvaffaqiyatli yangilandi!')
      } else {
        message.error(data.error || 'Xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Error saving currency rate:', error)
      message.error('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Sozlamalar</h1>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Tizim sozlamalari</p>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Currency Rate Settings */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <DollarOutlined style={{ marginRight: 8 }} />
                Valyuta Kursi
              </Title>
              <Paragraph>
                1 AQSH dollari (USD) = so'm (UZS) kursini sozlang. Bu kurs barcha mahsulot narxlarida ko'rsatiladi.
              </Paragraph>
            </div>
            <Divider />
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  1 USD = ? UZS
                </Text>
                <Input
                  type="number"
                  value={currencyRate}
                  onChange={(e) => setCurrencyRate(e.target.value)}
                  placeholder="13000"
                  size="large"
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }}
                  disabled={loading}
                />
                <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
                  Masalan: 13000, 13500, 14000
                </Text>
              </div>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                onClick={handleSaveCurrencyRate}
                loading={saving}
                disabled={loading}
              >
                Saqlash
              </Button>
            </div>
            {currencyRate && !isNaN(parseFloat(currencyRate)) && (
              <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 4, border: '1px solid #bae6fd' }}>
                <Text strong>Namuna:</Text>
                <Text style={{ display: 'block', marginTop: 4 }}>
                  $100 = {parseFloat(currencyRate) * 100} so'm
                </Text>
              </div>
            )}
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                Environment Variables
              </Title>
              <Paragraph>
                Configure your environment variables in your deployment platform (Vercel) or .env.local file.
              </Paragraph>
            </div>
            <Divider />
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, fontFamily: 'monospace' }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>DATABASE_URL</Text>
                <Text style={{ marginLeft: 8, color: '#8c8c8c' }}>
                  - PostgreSQL connection string
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>BLOB_READ_WRITE_TOKEN</Text>
                <Text style={{ marginLeft: 8, color: '#8c8c8c' }}>
                  - Vercel Blob Storage token
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>ADMIN_USERNAME</Text>
                <Text style={{ marginLeft: 8, color: '#8c8c8c' }}>
                  - Admin dashboard username
                </Text>
              </div>
              <div>
                <Text strong>ADMIN_PASSWORD</Text>
                <Text style={{ marginLeft: 8, color: '#8c8c8c' }}>
                  - Admin dashboard password
                </Text>
              </div>
            </div>
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <DatabaseOutlined style={{ marginRight: 8 }} />
                Database Setup
              </Title>
              <Paragraph>
                Run the following commands to set up your database:
              </Paragraph>
            </div>
            <Divider />
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, fontFamily: 'monospace' }}>
              <div style={{ marginBottom: 8, color: '#8c8c8c' }}>
                # Install dependencies
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>npm install</Text>
              </div>
              <div style={{ marginBottom: 8, color: '#8c8c8c' }}>
                # Generate Prisma Client
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>npx prisma generate</Text>
              </div>
              <div style={{ marginBottom: 8, color: '#8c8c8c' }}>
                # Push schema to database
              </div>
              <div>
                <Text strong>npx prisma db push</Text>
              </div>
            </div>
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <CloudServerOutlined style={{ marginRight: 8 }} />
                Deployment
              </Title>
              <Paragraph>
                This application is ready to deploy on Vercel. Make sure to:
              </Paragraph>
            </div>
            <Divider />
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>Connect your GitHub repository to Vercel</li>
              <li style={{ marginBottom: 8 }}>Add all environment variables in Vercel dashboard</li>
              <li style={{ marginBottom: 8 }}>Set up a PostgreSQL database (Vercel Postgres or external)</li>
              <li style={{ marginBottom: 8 }}>Configure Vercel Blob Storage and add the token</li>
              <li>Deploy and run database migrations</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
