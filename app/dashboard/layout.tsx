'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Simple auth check - in production, use proper session management
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-light">Loading...</div>
      </div>
    )
  }

  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/products', label: 'Products' },
    { href: '/dashboard/orders', label: 'Orders' },
    { href: '/dashboard/gallery', label: 'Gallery' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-xl font-serif font-semibold">
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('dashboard_auth')
                  router.push('/dashboard/login')
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
