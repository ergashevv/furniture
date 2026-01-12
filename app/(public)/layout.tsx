'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { NotificationProvider } from '@/components/Notification'
import { I18nProvider } from '@/contexts/I18nContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <CurrencyProvider>
        <CartProvider>
          <NotificationProvider>
            <Navigation />
            <main className="min-h-screen pb-20 md:pb-0">{children}</main>
            <Footer />
          </NotificationProvider>
        </CartProvider>
      </CurrencyProvider>
    </I18nProvider>
  )
}
