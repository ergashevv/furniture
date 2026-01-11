import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-4">Furni Glass</h3>
            <p className="text-white/80 text-sm mb-4">
              Biz sifatli va arzon mebellarni taqdim etishga intilamiz.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <span className="text-lg">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Telegram"
              >
                <span className="text-lg">✈️</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <span className="text-lg">👥</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">TEZKOR HAVOLALAR</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/products" className="hover:text-secondary transition-colors">
                  Mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-secondary transition-colors">
                  Galereya
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-secondary transition-colors">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">XIZMATLARIMIZ</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/services" className="hover:text-secondary transition-colors">
                  Interer dizayn
                </Link>
              </li>
              <li>
                <Link href="/interior-design" className="hover:text-secondary transition-colors">
                  3D Dizayn
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-secondary transition-colors">
                  Maxsus buyurtma
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary transition-colors">
                  Yetkazib berish
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">ALOQA MA&apos;LUMOTLARI</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+998901234567" className="hover:text-secondary transition-colors">
                  +998 90 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href="mailto:info@furniglass.uz"
                  className="hover:text-secondary transition-colors"
                >
                  info@furniglass.uz
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Toshkent, Yunusobod tumani</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Furni Glass. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Foydalanish shartlari
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Maxfiylik siyosati
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
