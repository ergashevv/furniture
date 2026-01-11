'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { NotificationProvider } from '@/components/Notification'
import { I18nProvider } from '@/contexts/I18nContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
    <CartProvider>
      <NotificationProvider>
        <Navigation />
          <main className="min-h-screen">{children}</main>
        <Footer />
      </NotificationProvider>
    </CartProvider>
    </I18nProvider>
  )
}
