'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
      label: 'Bosh sahifa',
    },
    {
      key: '/dashboard/products',
      icon: <ShoppingOutlined />,
      label: 'Mahsulotlar',
    },
    {
      key: '/dashboard/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Buyurtmalar',
    },
    {
      key: '/dashboard/categories',
      icon: <AppstoreOutlined />,
      label: 'Kategoriyalar',
    },
    {
      key: '/dashboard/gallery',
      icon: <PictureOutlined />,
      label: 'Galereya',
    },
    {
      key: '/dashboard/banner',
      icon: <FileTextOutlined />,
      label: 'Bannerlar',
    },
    {
      key: '/dashboard/services',
      icon: <CustomerServiceOutlined />,
      label: 'Xizmatlar',
    },
    {
      key: '/dashboard/stores',
      icon: <ShopOutlined />,
      label: 'Filiallar',
    },
    {
      key: '/dashboard/messages',
      icon: <MessageOutlined />,
      label: 'Xabarlar',
    },
    {
      key: '/dashboard/reviews',
      icon: <StarOutlined />,
      label: 'Sharhlar',
    },
    {
      key: '/dashboard/settings',
      icon: <SettingOutlined />,
      label: 'Sozlamalar',
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
    } else {
      router.push(key as string)
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
          colorPrimary: '#1a472a',
          borderRadius: 8,
        },
      }}
    >
      <NotificationProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={250}
            style={{
              background: colorBgContainer,
              borderRight: '1px solid #f0f0f0',
            }}
          >
            <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
              <FurniGlassLogo />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={navItems}
              onClick={handleMenuClick}
              style={{ borderRight: 0, height: 'calc(100vh - 64px)', overflow: 'auto' }}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: '0 24px',
                background: colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: 18, cursor: 'pointer' }}
                />
              ) : (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: 18, cursor: 'pointer' }}
                />
              )}
            </Header>
            <Content
              style={{
                margin: '24px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
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
