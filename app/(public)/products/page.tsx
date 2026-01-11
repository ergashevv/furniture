'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categorySlug = searchParams.get('category')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?visible=true'),
          fetch('/api/categories'),
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        if (productsData.success) {
          setProducts(productsData.products)
        }

        if (categoriesData.success) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug)
    }
  }, [categorySlug])

  const filteredAndSearchedProducts = useMemo(() => {
    let filtered = products

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category?.slug === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return 0 // Already sorted by creation date from API
      }
    })

    return sorted
  }, [products, selectedCategory, searchQuery, sortBy])

  const currentCategory = categories.find((cat) => cat.slug === selectedCategory)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              {currentCategory ? currentCategory.name : 'Barcha mahsulotlar'}
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              {currentCategory
                ? currentCategory.description || 'Premium mahsulotlar kolleksiyasi'
                : 'Premium mebel kolleksiyasi'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 px-4 border-b border-primary/10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Sort - Compact */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Mahsulot qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 border-2 border-primary/20 rounded-full focus:outline-none focus:border-primary transition-colors text-text placeholder:text-text-light text-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-light hover:text-primary transition-colors text-lg"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-text-light text-sm font-medium whitespace-nowrap">Saralash:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 border-2 border-primary/20 rounded-full focus:outline-none focus:border-primary transition-colors bg-white text-text text-sm font-medium cursor-pointer"
              >
                <option value="newest">Yangi</option>
                <option value="price-low">Narx: Pastdan yuqoriga</option>
                <option value="price-high">Narx: Yuqoridan pastga</option>
                <option value="name">Nomi bo&apos;yicha</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-background-dark text-text hover:bg-primary/10'
              }`}
            >
              Barchasi
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                  selectedCategory === category.slug
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-background-dark text-text hover:bg-primary/10'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-3 text-center text-text-light text-sm">
            {filteredAndSearchedProducts.length} ta mahsulot
            {searchQuery && (
              <span className="ml-2">
                &quot;<strong className="text-primary">{searchQuery}</strong>&quot; bo&apos;yicha topildi
              </span>
            )}
            {!searchQuery && selectedCategory !== 'all' && (
              <span className="ml-1">ko&apos;rsatilmoqda</span>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-text-light">Yuklanmoqda...</p>
            </div>
          ) : filteredAndSearchedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-light text-lg mb-4">
                Bu kategoriyada mahsulot topilmadi
              </p>
              <Link
                href="/products"
                className="inline-block text-primary hover:text-secondary transition-colors font-medium"
              >
                Barcha mahsulotlarni ko&apos;rish →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSearchedProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.05}>
                  <Link href={`/products/${product.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group h-full flex flex-col">
                      <div className="aspect-square bg-background-dark relative overflow-hidden">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                        {product.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-block bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Yangi
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        {product.category && (
                          <span className="inline-block text-secondary text-xs font-medium mb-2">
                            {product.category.name}
                          </span>
                        )}
                        <h3 className="text-xl font-serif font-semibold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        {product.price && (
                          <div className="flex items-center gap-2 mb-4 mt-auto">
                            <span className="text-primary font-bold text-2xl">
                              ${product.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {product.description && (
                          <p className="text-text-light text-sm line-clamp-2 mb-4">
                            {product.description}
                          </p>
                        )}
                        <span className="text-primary text-sm font-medium group-hover:text-secondary transition-colors inline-flex items-center mt-auto">
                          Batafsil{' '}
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
    </div>
  )
}
