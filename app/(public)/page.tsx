'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark to-background opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mb-6 text-balance"
          >
            Crafted for
            <br />
            <span className="text-secondary">Eternity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-text-light mb-10 max-w-2xl mx-auto"
          >
            Premium custom furniture designed to perfection. Every piece tells a story of
            craftsmanship and elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/order"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-medium"
            >
              Start Your Order
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-16">
              Our Services
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Custom Design',
                description: 'Tailored furniture designed specifically for your space and style.',
                icon: '✏️',
              },
              {
                title: 'Premium Materials',
                description: 'Only the finest materials sourced from trusted artisans worldwide.',
                icon: '🪵',
              },
              {
                title: 'Expert Craftsmanship',
                description: 'Masters of their craft, bringing your vision to life with precision.',
                icon: '🔨',
              },
            ].map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-text-light">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-16">
              Featured Collection
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-medium">
              <div className="md:grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto bg-background-dark">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">🪑</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                    Elegant Dining Set
                  </h3>
                  <p className="text-text-light mb-6 text-lg">
                    A timeless dining collection that combines modern elegance with
                    traditional craftsmanship. Perfect for intimate dinners and grand
                    gatherings alike.
                  </p>
                  <Link
                    href="/order"
                    className="inline-block bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark transition-all duration-300 w-fit"
                  >
                    Order Custom
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Let&apos;s create something extraordinary together. Start your custom furniture
              order today.
            </p>
            <Link
              href="/order"
              className="inline-block bg-secondary text-primary px-8 py-4 rounded-full font-semibold hover:bg-secondary-dark transition-all duration-300 hover:scale-105 shadow-medium"
            >
              Start Your Order
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-primary text-white p-4 shadow-lg">
        <Link
          href="/order"
          className="block w-full text-center bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark transition-all"
        >
          Start Your Order
        </Link>
      </div>
    </>
  )
}
