'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useMemo, memo } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Memoize variants to prevent recalculation on each render
  const variants = useMemo(() => {
    const offset = 30 // Reduced from 40 for smoother animation
    return {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
        x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 0.5, // Slightly faster for snappier feel
          delay,
          ease: [0.25, 0.1, 0.25, 1], // CSS ease equivalent - smoother
        },
      },
    }
  }, [direction, delay])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      style={{ willChange: isInView ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export default memo(ScrollReveal)
