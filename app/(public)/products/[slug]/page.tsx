'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { useCart } from '@/contexts/CartContext'
import { useNotification } from '@/components/Notification'
import { useI18n } from '@/contexts/I18nContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ColorVariant {
  name: string
  hex: string
  imageUrl?: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  originalPrice: number | null
  imageUrl: string | null
  images: string[]
  featured: boolean
  visible: boolean
  size: string | null
  material: string | null
  warranty: string | null
  colors: string[]
  dimensions?: string | null
  weight?: string | null
  deliveryInfo?: string | null
  specifications?: any
  // Professional furniture fields
  colorVariants?: ColorVariant[] | null
  materialDetails?: string | null
  assemblyRequired?: boolean
  assemblyInfo?: string | null
  careInstructions?: string | null
  capacity?: string | null
  style?: string | null
  finish?: string | null
  frameMaterial?: string | null
  cushionMaterial?: string | null
  legStyle?: string | null
  seatHeight?: string | null
  backSupport?: boolean
  armrests?: boolean
  storage?: boolean
  adjustable?: boolean
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, cartItems } = useCart()
  const { showNotification } = useNotification()
  const { language, t } = useI18n()
  const { formatUZS } = useCurrency()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  // Check if product is in cart
  const isInCart = product ? cartItems.some((item) => item.id === product.id) : false
  const cartItem = product ? cartItems.find((item) => item.id === product.id) : null
  const cartQuantity = cartItem?.quantity || 0

  async function fetchRelatedProducts(productId: string, categoryId: string | null) {
    if (!categoryId) return
    
    setLoadingRelated(true)
    try {
      const response = await fetch(
        `/api/products/related?productId=${productId}&categoryId=${categoryId}&limit=4&lang=${language}`
      )
      const data = await response.json()
      if (data.success) {
        setRelatedProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoadingRelated(false)
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/slug/${slug}?lang=${language}`)
        const data = await response.json()
        if (data.success && data.product) {
          setProduct(data.product)
          setSelectedImage(
            data.product.imageUrl ||
              (data.product.images && data.product.images.length > 0
                ? data.product.images[0]
                : null)
          )
          // Set first color as selected if colors exist
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0])
          }
          
          // Fetch related products
          fetchRelatedProducts(data.product.id, data.product.category?.id || null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, language])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-light">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            {t('products.notFound')}
          </h1>
          <p className="text-text-light mb-8">
            {t('products.notFoundDescription')}
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-none hover:bg-secondary transition-colors font-semibold"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  const displayImages = product.imageUrl
    ? [product.imageUrl, ...(product.images || [])].filter(Boolean)
    : product.images || []

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-background border-b border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <nav className="flex items-center gap-2 text-sm text-text-light">
              <button
                onClick={() => router.back()}
                className="hover:text-primary transition-colors flex items-center gap-1"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t('common.back')}
              </button>
              <span>/</span>
              <Link href="/" className="hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-primary transition-colors">
                {t('nav.products')}
              </Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-primary font-medium">{product.name}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <ScrollReveal>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-background-dark rounded-2xl overflow-hidden relative">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>
                {/* Thumbnail Images */}
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {displayImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square bg-background-dark rounded-lg overflow-hidden relative border-2 transition-all ${
                          selectedImage === image
                            ? 'border-primary'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 12.5vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col">
                {product.category && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="inline-block text-secondary hover:text-primary transition-colors text-sm font-medium mb-4"
                  >
                    {product.category.name}
                  </Link>
                )}
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                  {product.name}
                </h1>

                {/* Price Section */}
                {product.price && (
                  <div className="mb-6">
                    <div className="text-sm text-text-light mb-2">{t('products.suggestedPrice')}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xl text-text-light line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-serif font-bold text-primary">
                        {t('products.from')} ${product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-text-light mt-1">
                      ≈ {formatUZS(product.price)} {t('common.currency')}
                    </div>
                  </div>
                )}

                {/* Product Specifications - Professional furniture details */}
                {(product.dimensions || product.weight || product.material || product.materialDetails || 
                  product.capacity || product.style || product.finish || product.frameMaterial || 
                  product.cushionMaterial || product.legStyle || product.seatHeight || product.warranty) && (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('products.specifications')}
                    </h3>
                    <div className="bg-background-dark rounded-xl p-5 border border-primary/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.dimensions && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.dimensions')}</span>
                              <span className="text-text font-semibold">{product.dimensions}</span>
                            </div>
                          </div>
                        )}
                        {product.weight && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.weight')}</span>
                              <span className="text-text font-semibold">{product.weight}</span>
                            </div>
                          </div>
                        )}
                        {product.capacity && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.capacity')}</span>
                              <span className="text-text font-semibold">{product.capacity}</span>
                            </div>
                          </div>
                        )}
                        {product.style && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.style')}</span>
                              <span className="text-text font-semibold">{product.style}</span>
                            </div>
                          </div>
                        )}
                        {product.finish && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.finish')}</span>
                              <span className="text-text font-semibold">{product.finish}</span>
                            </div>
                          </div>
                        )}
                        {product.material && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.material')}</span>
                              <span className="text-text font-semibold">{product.material}</span>
                            </div>
                          </div>
                        )}
                        {product.frameMaterial && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.frameMaterial')}</span>
                              <span className="text-text font-semibold">{product.frameMaterial}</span>
                            </div>
                          </div>
                        )}
                        {product.cushionMaterial && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.cushionMaterial')}</span>
                              <span className="text-text font-semibold">{product.cushionMaterial}</span>
                            </div>
                          </div>
                        )}
                        {product.legStyle && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.legStyle')}</span>
                              <span className="text-text font-semibold">{product.legStyle}</span>
                            </div>
                          </div>
                        )}
                        {product.seatHeight && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.seatHeight')}</span>
                              <span className="text-text font-semibold">{product.seatHeight}</span>
                            </div>
                          </div>
                        )}
                        {product.warranty && (
                          <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-text-light text-sm font-medium block mb-1">{t('products.warranty')}</span>
                              <span className="text-text font-semibold">{product.warranty}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {product.materialDetails && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <span className="text-text-light text-sm font-medium block mb-2">{t('products.materialDetails')}</span>
                          <p className="text-text leading-relaxed">{product.materialDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Features - Boolean features */}
                {(product.backSupport !== undefined || product.armrests !== undefined || 
                  product.storage !== undefined || product.adjustable !== undefined) && (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('products.productFeatures')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {product.backSupport !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          product.backSupport 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          {product.backSupport ? (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`text-sm font-semibold ${
                            product.backSupport 
                              ? 'text-green-800 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {t('products.backSupport')}
                          </span>
                        </div>
                      )}
                      {product.armrests !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          product.armrests 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          {product.armrests ? (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`text-sm font-semibold ${
                            product.armrests 
                              ? 'text-green-800 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {t('products.armrests')}
                          </span>
                        </div>
                      )}
                      {product.storage !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          product.storage 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          {product.storage ? (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`text-sm font-semibold ${
                            product.storage 
                              ? 'text-green-800 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {t('products.storage')}
                          </span>
                        </div>
                      )}
                      {product.adjustable !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          product.adjustable 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          {product.adjustable ? (
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`text-sm font-semibold ${
                            product.adjustable 
                              ? 'text-green-800 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {t('products.adjustable')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Assembly Info */}
                {product.assemblyRequired && (
                  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                          {t('products.assemblyRequired')}
                        </h3>
                        {product.assemblyInfo && (
                          <p className="text-yellow-700 dark:text-yellow-400 text-sm">{product.assemblyInfo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Variants - Professional furniture colors */}
                {(product.colorVariants && product.colorVariants.length > 0) || (product.colors && product.colors.length > 0) ? (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {t('products.colorVariants')}
                    </h3>
                    {product.colorVariants && product.colorVariants.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.colorVariants.map((variant: ColorVariant, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedColor(variant.hex)
                              if (variant.imageUrl) {
                                setSelectedImage(variant.imageUrl)
                              }
                            }}
                            className={`relative group border-2 rounded-xl overflow-hidden transition-all ${
                              selectedColor === variant.hex
                                ? 'border-primary scale-105 shadow-lg ring-2 ring-primary/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                            }`}
                          >
                            {variant.imageUrl ? (
                              <div className="aspect-square relative">
                                <Image
                                  src={variant.imageUrl}
                                  alt={variant.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>
                            ) : (
                              <div
                                className="aspect-square"
                                style={{ backgroundColor: variant.hex }}
                              />
                            )}
                            <div className={`absolute bottom-0 left-0 right-0 py-2 px-3 text-center transition-colors ${
                              selectedColor === variant.hex
                                ? 'bg-primary text-white'
                                : 'bg-black/70 text-white group-hover:bg-black/80'
                            }`}>
                              <span className="text-sm font-semibold">{variant.name}</span>
                            </div>
                            {selectedColor === variant.hex && (
                              <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                            className={`w-16 h-16 rounded-xl border-2 transition-all shadow-md ${
                            selectedColor === color
                                ? 'border-primary scale-110 shadow-lg ring-2 ring-primary/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: color }}
                            aria-label={`${t('products.selectColor')} ${color}`}
                            title={color}
                          >
                            {selectedColor === color && (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Delivery Info */}
                {product.deliveryInfo && (
                  <div className="mb-8 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-primary mb-2 flex items-center gap-2">
                          {t('products.deliveryInfo')}
                        </h3>
                        <p className="text-text leading-relaxed">{product.deliveryInfo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Care Instructions */}
                {product.careInstructions && (
                  <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                          {t('products.careInstructions')}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-400 leading-relaxed whitespace-pre-line">
                          {product.careInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}


                {/* Description */}
                <div className="prose max-w-none mb-8">
                  <p className="text-text-light text-lg leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                {product.price && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">{t('products.quantity')}</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
                        aria-label={t('common.decrease')}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 h-10 border-2 border-primary/20 text-center rounded-lg focus:outline-none focus:border-primary transition-colors font-semibold"
                        aria-label={t('products.quantity')}
                      />
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
                        aria-label={t('common.increase')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto space-y-4">
                  {product.price && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          for (let i = 0; i < quantity; i++) {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: product.price!,
                              imageUrl: product.imageUrl,
                            })
                          }
                          showNotification(t('cart.added'), 'success')
                          setQuantity(1)
                        }}
                        className={`flex-1 text-center py-4 rounded-lg transition-colors font-semibold ${
                          isInCart
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        {isInCart ? `${t('cart.inCart')} (${cartQuantity})` : t('cart.addToCart')}
                      </button>
                      <button 
                        className="w-14 h-14 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center"
                        aria-label={t('products.favorite')}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <Link
                    href="/products"
                    className="block w-full bg-background-dark text-primary text-center py-4 rounded-lg hover:bg-primary/5 transition-colors font-semibold border border-primary/10"
                  >
                    {t('products.viewAll')}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {product.category && (
        <section className="py-20 px-4 bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                  {t('products.relatedProducts')}
                </h2>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-primary hover:text-secondary transition-colors font-medium text-sm md:text-base"
                >
                  {t('products.viewAll')} →
                </Link>
              </div>
            </ScrollReveal>
            
            {loadingRelated ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ScrollReveal key={relatedProduct.id} delay={index * 0.1}>
                    <Link href={`/products/${relatedProduct.slug}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group h-full flex flex-col">
                        <div className="aspect-square bg-background-dark relative overflow-hidden">
                          {relatedProduct.imageUrl && (
                            <Image
                              src={relatedProduct.imageUrl}
                              alt={relatedProduct.name}
                              fill
                              loading="lazy"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          )}
                          {relatedProduct.featured && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-block bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                {t('products.new')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-serif font-semibold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                            {relatedProduct.name}
                          </h3>
                          {relatedProduct.price && (
                            <div className="mt-auto">
                              <span className="text-primary font-bold text-lg">
                                {t('products.from')} ${relatedProduct.price.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-light mb-4">{t('products.noRelatedProducts')}</p>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-block text-primary hover:text-secondary transition-colors font-medium"
                >
                  {product.category.name} {t('products.viewAllInCategory')} →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
