import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Premium Custom Furniture | Artisan Craftsmanship',
  description: 'Discover bespoke furniture crafted with precision and elegance. Custom designs for your home.',
  keywords: 'custom furniture, premium furniture, bespoke furniture, handmade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
