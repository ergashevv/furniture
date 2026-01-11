'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { useCart } from '@/contexts/CartContext'
import { useNotification } from '@/components/Notification'

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
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { showNotification } = useNotification()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  async function fetchRelatedProducts(productId: string, categoryId: string | null) {
    if (!categoryId) return
    
    setLoadingRelated(true)
    try {
      const response = await fetch(
        `/api/products/related?productId=${productId}&categoryId=${categoryId}&limit=4`
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
        const response = await fetch(`/api/products/slug/${slug}`)
        const data = await response.json()
        if (data.success && data.product) {
          setProduct(data.product)
          setSelectedImage(
            data.product.imageUrl ||
              (data.product.images && data.product.images.length > 0
                ? data.product.images[0]
                : null)
          )
          
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
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-light">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Mahsulot topilmadi
          </h1>
          <p className="text-text-light mb-8">
            So&apos;ralgan mahsulot mavjud emas yoki o&apos;chirilgan.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-none hover:bg-secondary transition-colors font-semibold"
          >
            Bosh sahifaga qaytish
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
                Orqaga
              </button>
              <span>/</span>
              <Link href="/" className="hover:text-primary transition-colors">
                Bosh sahifa
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-primary transition-colors">
                Mahsulotlar
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
                    <div className="text-sm text-text-light mb-2">Tavsiya narxi</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xl text-text-light line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-serif font-bold text-primary">
                        From ${product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-text-light mt-1">
                      ≈ {(product.price * 13000).toLocaleString()} so&apos;m
                    </div>
                  </div>
                )}

                {/* Product Details */}
                {(product.size || product.material || product.warranty) && (
                  <div className="mb-6 space-y-3">
                    <h3 className="text-lg font-semibold text-primary mb-3">Xususiyatlar</h3>
                    <div className="space-y-2">
                      {product.size && (
                        <div className="flex items-center gap-3">
                          <span className="text-text-light font-medium min-w-[100px]">O&apos;lcham:</span>
                          <span className="text-text">{product.size}</span>
                        </div>
                      )}
                      {product.material && (
                        <div className="flex items-center gap-3">
                          <span className="text-text-light font-medium min-w-[100px]">Material:</span>
                          <span className="text-text">{product.material}</span>
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex items-center gap-3">
                          <span className="text-text-light font-medium min-w-[100px]">Kafolat:</span>
                          <span className="text-text">{product.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">Ranglar</h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? 'border-primary scale-110'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
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
                    <h3 className="text-lg font-semibold text-primary mb-3">Miqdor</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 h-10 border-2 border-primary/20 text-center rounded-lg focus:outline-none focus:border-primary transition-colors font-semibold"
                      />
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
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
                          showNotification(`Mahsulot savatchaga qo'shildi!`, 'success')
                          setQuantity(1)
                        }}
                        className="flex-1 bg-primary text-white text-center py-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                      >
                        Savatchaga qo&apos;shish
                      </button>
                      <button className="w-14 h-14 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center">
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
                    Barcha mahsulotlar
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
                  O&apos;xshash mahsulotlar
                </h2>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-primary hover:text-secondary transition-colors font-medium text-sm md:text-base"
                >
                  Barchasini ko&apos;rish →
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
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          )}
                          {relatedProduct.featured && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-block bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                Yangi
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
                                ${relatedProduct.price.toLocaleString()}
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
                <p className="text-text-light mb-4">O&apos;xshash mahsulotlar topilmadi</p>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-block text-primary hover:text-secondary transition-colors font-medium"
                >
                  {product.category.name} bo&apos;limidagi barcha mahsulotlarni ko&apos;rish →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
