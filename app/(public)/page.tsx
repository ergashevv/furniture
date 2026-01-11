'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  imageUrl: string | null
  images: string[]
  featured: boolean
  visible: boolean
  category: Category | null
}

interface GalleryItem {
  id: string
  title: string
  description: string | null
  imageUrl: string
  videoUrl: string | null
  category: string | null
  featured: boolean
  visible: boolean
  order: number
}

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonText: string | null
  buttonLink: string | null
  overlay: number
  visible: boolean
  order: number
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes, galleryRes, bannerRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?featured=true&visible=true'),
          fetch('/api/gallery?visible=true&featured=true'),
          fetch('/api/banner?includeHidden=false'),
        ])

        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()
        const galleryData = await galleryRes.json()
        const bannerData = await bannerRes.json()

        if (categoriesData.success) {
          setCategories(categoriesData.categories.slice(0, 3)) // First 3 categories
        }

        if (productsData.success) {
          setProducts(productsData.products.slice(0, 3)) // First 3 featured products
        }

        if (galleryData.success) {
          setGalleryItems(galleryData.items.slice(0, 6)) // First 6 featured gallery items
        }

        if (bannerData.success && bannerData.banners.length > 0) {
          // Get the first visible banner (ordered by order field)
          setBanner(bannerData.banners[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Category images mapping (you can replace with real images from database later)
  const categoryImages: Record<string, string> = {
    dining: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80',
    living: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    bedroom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  }

  const collections = [
    {
      title: 'Divanlar',
      link: '/gallery?type=sofa',
    },
    {
      title: 'Stollar',
      link: '/gallery?type=table',
    },
    {
      title: 'Stullar',
      link: '/gallery?type=chair',
    },
  ]

  const stats = [
    { number: '25+', label: 'Yillik tajriba' },
    { number: '5K+', label: 'Mamnun mijozlar' },
    { number: '2.5K', label: 'Bajarilgan loyihalar' },
    { number: '100%', label: 'Sifat kafolati' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: banner
              ? `url('${banner.imageUrl}')`
              : "url('https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1920&q=80')",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${banner ? banner.overlay : 0.5})`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            {banner?.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm uppercase tracking-wider mb-4 text-gray-300"
              >
                {banner.subtitle}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight"
            >
              {banner ? banner.title : 'Bayramona\ninteryer'}
            </motion.h1>
            {banner?.description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg md:text-xl mb-6 text-gray-200"
              >
                {banner.description}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {banner?.buttonText && banner?.buttonLink ? (
                <Link
                  href={banner.buttonLink}
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-none border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 font-semibold uppercase tracking-wide"
                >
                  {banner.buttonText} →
                </Link>
              ) : (
                <Link
                  href="/order"
                  className="inline-block bg-white text-gray-900 px-8 py-4 rounded-none border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 font-semibold uppercase tracking-wide"
                >
                  Ko&apos;proq ko&apos;rish →
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Removed emojis, using text-only */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScrollReveal delay={0}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-primary mb-1">Bepul yetkazish</h3>
                <p className="text-sm text-text-light">Free delivery</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-primary mb-1">3 yil kafolat</h3>
                <p className="text-sm text-text-light">3 years warranty</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-primary mb-1">14 kun qaytarish</h3>
                <p className="text-sm text-text-light">14 days return</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-primary mb-1">Tez o&apos;rnatish</h3>
                <p className="text-sm text-text-light">Fast installation</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Search Section - "Nima qidiryapsiz?" */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-background/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4">
                Nima qidiryapsiz?
              </h2>
              <p className="text-text-light text-lg max-w-2xl mx-auto">
                O&apos;z xohishingizga mos kategoriyani tanlang va ajoyib dizayn yechimlarini kashf eting
              </p>
            </div>
          </ScrollReveal>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {categories.map((category, index) => (
                <ScrollReveal key={category.id} delay={index * 0.15}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group block h-full"
                  >
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 border border-primary/5 hover:border-primary/20 h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-background-dark to-background overflow-hidden">
                        {categoryImages[category.slug] && (
                          <>
                            <Image
                              src={categoryImages[category.slug]}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </>
                        )}
                        {/* Overlay badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            Ko&apos;rish
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-serif font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-text-light text-sm leading-relaxed line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="mt-6 flex items-center text-secondary font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                          <span className="text-sm uppercase tracking-wider">Batafsil</span>
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Hover border effect */}
                      <div className="absolute inset-0 border-2 border-secondary rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                Bizning yo&apos;nalishlarimiz
              </h2>
              <p className="text-text-light text-lg">
                Maxsus mebellarni ko&apos;rish uchun yo&apos;nalishni tanlang
              </p>
            </div>
          </ScrollReveal>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                  <ScrollReveal key={category.id} delay={index * 0.1}>
                    <Link href={`/products?category=${category.slug}`}>
                      <div className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-primary/5 hover:border-primary/20">
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {categoryImages[category.slug] && (
                          <Image
                            src={categoryImages[category.slug]}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-serif font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-text-light mb-4 text-sm leading-relaxed">
                          {category.description}
                        </p>
                        <span className="inline-flex items-center text-secondary font-medium group-hover:gap-2 gap-1 transition-all">
                          Batafsil
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                Mashhur mahsulotlar
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link
                href="/products"
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Barchasini ko&apos;rish →
              </Link>
            </ScrollReveal>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1}>
                  <Link href={`/products/${product.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow">
                      <div className="aspect-square bg-background-dark relative">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <span className="inline-block bg-secondary/20 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-3">
                          Yangi
                        </span>
                        <h3 className="text-xl font-serif font-semibold text-primary mb-2">
                          {product.name}
                        </h3>
                        {product.price && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-primary font-bold">From ${product.price}</span>
                          </div>
                        )}
                        {product.category && (
                          <p className="text-text-light text-sm">{product.category.name}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                To&apos;plamlar
              </h2>
              <p className="text-text-light text-lg">
                Bizning eng mashhur mebel to&apos;plamlari
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <ScrollReveal key={collection.title} delay={index * 0.1}>
                <Link href={collection.link}>
                  <div className="bg-background-dark rounded-2xl p-8 hover:shadow-medium transition-shadow duration-300 border border-primary/10 text-center">
                    <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
                      {collection.title}
                    </h3>
                    <span className="text-secondary font-medium">Ko&apos;rish →</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order CTA Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Maxsus buyurtma
            </h2>
            <p className="text-text-light text-lg mb-8">
              O&apos;z xohishingizga mos mebel buyurtma qiling
            </p>
            <Link
              href="/order"
              className="inline-block bg-primary text-white px-8 py-4 rounded-none hover:bg-secondary transition-colors duration-300 font-semibold uppercase tracking-wide"
            >
              Buyurtma berish
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Works Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                Bizning ishlarimiz
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link
                href="/gallery"
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Barcha loyihalar →
              </Link>
            </ScrollReveal>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.length > 0
                  ? galleryItems.map((item) => (
                      <Link key={item.id} href="/gallery">
                        <div className="group aspect-square bg-background-dark rounded-2xl overflow-hidden cursor-pointer">
                          <div className="relative w-full h-full">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                              <h3 className="text-white font-serif font-semibold text-lg">
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  : [1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square bg-background-dark rounded-2xl overflow-hidden"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                      </div>
                    ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-serif font-bold text-secondary mb-3">
                    {stat.number}
                  </div>
                  <div className="text-text-light font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Biz bilan bog&apos;laning
            </h2>
            <p className="text-text-light text-lg mb-8">
              Savollaringiz bormi? Bizga yozing va biz tez orada javob beramiz
            </p>
            <Link
              href="/order"
              className="inline-block bg-primary text-white px-8 py-4 rounded-none hover:bg-secondary transition-colors duration-300 font-semibold uppercase tracking-wide"
            >
              Aloqa
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-4 z-40 md:hidden shadow-lg">
        <Link
          href="/order"
          className="block text-center font-semibold uppercase tracking-wide"
        >
          Buyurtma berish →
        </Link>
      </div>
    </>
  )
}
