'use client'

import Link from 'next/link'
import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useI18n } from '@/contexts/I18nContext'
import FurniGlassLogo from './FurniGlassLogo'

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { language, setLanguage, t } = useI18n()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const isHomePage = pathname === '/'

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/services', label: t('nav.services') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/why-us', label: t('nav.whyUs') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <>
      {/* Desktop Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : isHomePage ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <FurniGlassLogo 
                width={150} 
                height={60} 
                priority 
                className="h-auto" 
                variant={isScrolled || !isHomePage ? 'default' : 'white'} 
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-1 py-2 font-medium transition-all duration-200 ${
                      isScrolled || !isHomePage
                        ? isActive
                          ? 'text-secondary'
                          : 'text-text hover:text-secondary'
                        : isActive
                          ? 'text-white'
                          : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          isScrolled || !isHomePage ? 'bg-secondary' : 'bg-white'
                        }`}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Language Switcher & Cart Desktop */}
            <div className="flex items-center gap-4 ml-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isScrolled || !isHomePage
                      ? 'text-text hover:bg-primary/10 hover:text-secondary'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Change language"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="text-sm font-semibold uppercase">{language}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isLanguageDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Language Dropdown */}
                <AnimatePresence>
                  {isLanguageDropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setIsLanguageDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-primary/10 py-2 min-w-[120px] z-50"
                      >
                        <button
                          onClick={() => {
                            setLanguage('uz')
                            setIsLanguageDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                            language === 'uz'
                              ? 'bg-primary/10 text-secondary'
                              : 'text-text hover:bg-primary/5'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            O&apos;zbek
                            {language === 'uz' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setLanguage('ru')
                            setIsLanguageDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                            language === 'ru'
                              ? 'bg-primary/10 text-secondary'
                              : 'text-text hover:bg-primary/5'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            Русский
                            {language === 'ru' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Icon Desktop */}
              <Link
                href="/cart"
                className={`relative ${isScrolled || !isHomePage ? 'text-text hover:text-secondary' : 'text-white hover:text-white/80'} transition-colors duration-200`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Top Header (Simplified - Logo + Cart only) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : isHomePage ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md'
        }`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <FurniGlassLogo 
                width={120} 
                height={48} 
                priority 
                className="h-auto" 
                variant={isScrolled || !isHomePage ? 'default' : 'white'} 
              />
            </Link>

            {/* Language Switcher & Cart Mobile */}
            <div className="flex items-center gap-3">
              {/* Language Switcher Mobile */}
              <button
                onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg font-semibold text-sm uppercase transition-all duration-200 ${
                  isScrolled || !isHomePage
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Change language"
              >
                {language === 'uz' ? 'RU' : 'UZ'}
              </button>

              {/* Cart Icon Mobile */}
              <Link
                href="/cart"
                className={`relative ${isScrolled || !isHomePage ? 'text-primary' : 'text-white'} transition-colors duration-200`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-primary/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
        <div className="px-4 py-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-primary text-white rounded-xl font-medium transition-all duration-200 active:scale-95 hover:bg-primary/90"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col safe-area-bottom"
            >
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-primary/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pb-4 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-primary">{t('common.menu')}</h2>
                  <div className="flex items-center gap-3">
                    {/* Language Switcher in Mobile Menu */}
                    <button
                      onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm uppercase transition-all duration-200 hover:bg-primary/20"
                      aria-label="Change language"
                    >
                      {language === 'uz' ? 'RU' : 'UZ'}
                    </button>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 -mr-2 text-text hover:text-primary transition-colors duration-200"
                      aria-label="Close menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-4 rounded-xl font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-secondary border-2 border-primary/20'
                            : 'text-text hover:bg-primary/5 hover:text-secondary active:scale-95'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{link.label}</span>
                          {isActive && (
                            <svg
                              className="w-5 h-5 text-secondary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Padding for Safe Area */}
              <div className="h-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Navigation)
