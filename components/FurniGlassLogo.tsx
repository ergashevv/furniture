'use client'

import Image from 'next/image'

interface FurniGlassLogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
  variant?: 'default' | 'white'
}

export default function FurniGlassLogo({ 
  className = '', 
  width = 150,
  height = 60,
  priority = false,
  variant = 'default'
}: FurniGlassLogoProps) {
  const logoSrc = variant === 'white' ? '/logo-white.png' : '/logo.png'
  
  return (
    <Image
      src={logoSrc}
      alt="Furni Glass Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}