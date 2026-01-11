'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'

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

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('all')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['all', 'dining', 'living', 'bedroom', 'office']

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        const response = await fetch('/api/gallery?visible=true')
        const data = await response.json()
        if (data.success) {
          setGalleryItems(data.items)
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  const filteredItems =
    filter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Our Gallery
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Explore our collection of custom-crafted furniture pieces
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-primary text-white'
                    : 'bg-background-dark text-text hover:bg-primary/10'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-text-light">Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-light text-lg">No items found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.05}>
                  <div className="group relative aspect-square bg-background-dark rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-serif font-semibold text-xl mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-white/90 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-12">
              See Our Craftsmanship
            </h2>
            <div className="relative aspect-video bg-primary/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-text-light">Video showcase coming soon</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
