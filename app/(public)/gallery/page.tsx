'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('all')

  // This would come from the database in a real app
  const categories = ['all', 'dining', 'living', 'bedroom', 'office']
  const galleryItems = [
    { id: 1, category: 'dining', title: 'Elegant Dining Set' },
    { id: 2, category: 'living', title: 'Modern Sofa Collection' },
    { id: 3, category: 'bedroom', title: 'Luxury Bed Frame' },
    { id: 4, category: 'office', title: 'Executive Desk' },
    { id: 5, category: 'dining', title: 'Kitchen Island' },
    { id: 6, category: 'living', title: 'Coffee Table Set' },
    { id: 7, category: 'bedroom', title: 'Wardrobe System' },
    { id: 8, category: 'office', title: 'Bookcase Collection' },
  ]

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.05}>
                <div className="group relative aspect-square bg-background-dark rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                      🪑
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <h3 className="text-white font-serif font-semibold text-xl">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
                  <div className="text-6xl mb-4">▶️</div>
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
