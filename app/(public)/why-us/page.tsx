'use client'

import ScrollReveal from '@/components/ScrollReveal'

export default function WhyUsPage() {
  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '500+', label: 'Happy Clients' },
    { number: '1000+', label: 'Pieces Crafted' },
    { number: '98%', label: 'Satisfaction Rate' },
  ]

  const features = [
    {
      title: 'Master Craftsmanship',
      description:
        'Our artisans have decades of experience creating furniture that stands the test of time.',
      icon: '🎨',
    },
    {
      title: 'Sustainable Materials',
      description:
        'We source only ethically harvested and sustainable materials for all our pieces.',
      icon: '🌳',
    },
    {
      title: 'Custom Design Process',
      description:
        'From concept to completion, we work closely with you to bring your vision to life.',
      icon: '✍️',
    },
    {
      title: 'Lifetime Guarantee',
      description:
        'Every piece comes with our commitment to quality and durability that lasts generations.',
      icon: '🛡️',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Consultation',
      description: 'We discuss your vision, space, and requirements in detail.',
    },
    {
      step: '02',
      title: 'Design',
      description: 'Our designers create custom plans tailored to your needs.',
    },
    {
      step: '03',
      title: 'Crafting',
      description: 'Master craftsmen bring your design to life with precision.',
    },
    {
      step: '04',
      title: 'Delivery',
      description: 'We ensure safe delivery and installation of your furniture.',
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Why Choose Us
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Excellence in every detail. Passion in every piece.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-light font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-16">
              What Sets Us Apart
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-soft">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-light">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-16">
              Our Process
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <ScrollReveal key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-6xl font-serif font-bold text-secondary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-light">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Built to Last Generations
            </h2>
            <p className="text-lg text-white/80">
              We don&apos;t just create furniture. We craft heirlooms that become part of your
              family&apos;s story for generations to come.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
