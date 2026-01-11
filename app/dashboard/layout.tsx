'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ConfigProvider, Layout, Menu, theme, Spin } from 'antd'
import type { MenuProps } from 'antd'
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  MessageOutlined,
  StarOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { NotificationProvider } from '@/components/Notification'
import FurniGlassLogo from '@/components/FurniGlassLogo'

const { Sider, Header, Content } = Layout

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem('dashboard_auth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      } else if (pathname !== '/dashboard/login') {
        router.push('/dashboard/login')
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [pathname, router])

  const navItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Bosh sahifa</Link>,
    },
    {
      key: '/dashboard/products',
      icon: <ShoppingOutlined />,
      label: <Link href="/dashboard/products">Mahsulotlar</Link>,
    },
    {
      key: '/dashboard/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/dashboard/orders">Buyurtmalar</Link>,
    },
    {
      key: '/dashboard/categories',
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/categories">Kategoriyalar</Link>,
    },
    {
      key: '/dashboard/gallery',
      icon: <PictureOutlined />,
      label: <Link href="/dashboard/gallery">Galereya</Link>,
    },
    {
      key: '/dashboard/banner',
      icon: <FileTextOutlined />,
      label: <Link href="/dashboard/banner">Bannerlar</Link>,
    },
    {
      key: '/dashboard/services',
      icon: <CustomerServiceOutlined />,
      label: <Link href="/dashboard/services">Xizmatlar</Link>,
    },
    {
      key: '/dashboard/stores',
      icon: <ShopOutlined />,
      label: <Link href="/dashboard/stores">Filiallar</Link>,
    },
    {
      key: '/dashboard/messages',
      icon: <MessageOutlined />,
      label: <Link href="/dashboard/messages">Xabarlar</Link>,
    },
    {
      key: '/dashboard/reviews',
      icon: <StarOutlined />,
      label: <Link href="/dashboard/reviews">Sharhlar</Link>,
    },
    {
      key: '/dashboard/settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Sozlamalar</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      danger: true,
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('dashboard_auth')
      router.push('/dashboard/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F1F2E',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#1890ff',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Menu: {
            itemSelectedBg: 'rgba(15, 31, 46, 0.08)',
            itemSelectedColor: '#0F1F2E',
            itemHoverBg: 'rgba(15, 31, 46, 0.04)',
            itemActiveBg: 'rgba(15, 31, 46, 0.12)',
          },
          Button: {
            primaryColor: '#ffffff',
          },
        },
      }}
    >
      <NotificationProvider>
        <Layout style={{ minHeight: '100vh', background: '#F9F6F1' }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={260}
            style={{
              background: '#ffffff',
              borderRight: '1px solid #e8e8e8',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ padding: '20px 16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
              <FurniGlassLogo />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={navItems}
              onClick={handleMenuClick}
              style={{ 
                borderRight: 0, 
                height: 'calc(100vh - 80px)', 
                overflow: 'auto',
                background: '#ffffff',
              }}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: '0 24px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: 20, cursor: 'pointer', color: '#0F1F2E' }}
                />
              ) : (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: 20, cursor: 'pointer', color: '#0F1F2E' }}
                />
              )}
            </Header>
            <Content
              style={{
                margin: '24px',
                padding: 0,
                minHeight: 280,
                background: 'transparent',
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </NotificationProvider>
    </ConfigProvider>
  )
}
