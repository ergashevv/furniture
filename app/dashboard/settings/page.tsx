'use client'

import { Card, Typography, Space, Divider } from 'antd'
import { DatabaseOutlined, CloudServerOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Sozlamalar</h1>
        <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>Tizim sozlamalari</p>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
