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
            itemMarginInline: 8,
            itemBorderRadius: 6,
          },
          Button: {
            primaryColor: '#ffffff',
          },
          Card: {
            borderRadiusLG: 12,
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
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              overflow: 'auto',
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
          <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
            <Header
              style={{
                padding: '0 24px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
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
                padding: '24px',
                minHeight: 'calc(100vh - 112px)',
                background: '#ffffff',
                borderRadius: 12,
                overflow: 'auto',
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
