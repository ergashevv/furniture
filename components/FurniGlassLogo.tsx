'use client'

import Image from 'next/image'

interface FurniGlassLogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function FurniGlassLogo({ 
  className = '', 
  width = 150,
  height = 60,
  priority = false
}: FurniGlassLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Furni Glass Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}