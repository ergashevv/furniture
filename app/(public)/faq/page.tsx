'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Ordering',
    question: 'How long does it take to complete a custom order?',
    answer:
      "The timeline varies depending on the complexity of your design. Typically, custom orders take 6-12 weeks from final design approval to completion. We'll provide a detailed timeline during your consultation.",
  },
  {
    category: 'Ordering',
    question: 'Can I modify my order after it has been placed?',
    answer:
      'Modifications are possible during the design phase. Once production begins, changes may incur additional fees and extend the timeline. We recommend finalizing all details during the design consultation.',
  },
  {
    category: 'Pricing',
    question: 'How much does custom furniture cost?',
    answer:
      'Pricing depends on size, materials, complexity, and finishes. Our custom pieces typically range from $2,000 to $50,000+. We provide detailed quotes after understanding your requirements.',
  },
  {
    category: 'Pricing',
    question: 'Do you offer payment plans?',
    answer:
      'Yes, we offer flexible payment plans. Typically, we require a 50% deposit to begin production, with the remainder due upon completion and before delivery.',
  },
  {
    category: 'Materials',
    question: 'What materials do you work with?',
    answer:
      'We work with premium hardwoods (oak, walnut, cherry), sustainable materials, premium upholstery fabrics, and various metal finishes. We can source specific materials based on your preferences.',
  },
  {
    category: 'Materials',
    question: 'Are your materials sustainable?',
    answer:
      'Absolutely. We prioritize ethically sourced and sustainable materials. Many of our wood suppliers are FSC certified, and we use eco-friendly finishes whenever possible.',
  },
  {
    category: 'Delivery',
    question: 'Do you deliver and install?',
    answer:
      'Yes, we offer delivery and installation services. Our team carefully delivers and installs your furniture to ensure it arrives in perfect condition. Delivery area and fees depend on your location.',
  },
  {
    category: 'Delivery',
    question: 'What if I need to return or exchange?',
    answer:
      'Since all our pieces are custom-made, returns are not standard. However, we guarantee our craftsmanship. If there are any defects or issues, we will work with you to make it right.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  const filteredFaqs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Everything you need to know about our custom furniture process
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-primary/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
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

      {/* FAQ Accordion */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-background-dark/50 transition-colors"
                  >
                    <span className="font-semibold text-primary text-lg pr-4">
                      {faq.question}
                    </span>
                    <motion.svg
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      className="w-5 h-5 text-secondary flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-text-light">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Get in touch with us and we&apos;ll be happy to help
            </p>
            <a
              href="mailto:info@artisan.com"
              className="inline-block bg-secondary text-primary px-8 py-4 rounded-full font-semibold hover:bg-secondary-dark transition-all duration-300 hover:scale-105 shadow-medium"
            >
              Contact Us
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
