'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide loading when page is fully loaded
    const handleLoad = () => {
      // Small delay for smooth transition
      setTimeout(() => {
        setIsLoading(false)
      }, 400)
    }

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary/95 to-primary-dark/95 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Logo with smooth animation */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative w-40 h-40 md:w-48 md:h-48 mb-12"
            >
              <Image
                src="/logo-white.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Loading spinner with smooth animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative w-14 h-14"
            >
              <motion.div
                className="absolute inset-0 border-4 border-white/20 rounded-full"
              />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
