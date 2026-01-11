import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { NotificationProvider } from '@/components/Notification'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <NotificationProvider>
        <Navigation />
        <main className="min-h-screen pt-16 md:pt-20 pb-20 md:pb-0">{children}</main>
        <Footer />
      </NotificationProvider>
    </CartProvider>
  )
}
