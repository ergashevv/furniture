import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartProvider>
  )
}
