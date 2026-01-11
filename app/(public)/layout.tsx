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
        <main className="min-h-screen">{children}</main>
        <Footer />
      </NotificationProvider>
    </CartProvider>
  )
}
