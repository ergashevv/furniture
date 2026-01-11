import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const visible = searchParams.get('visible')

    const products = await prisma.product.findMany({
      where: {
        ...(featured === 'true' && { featured: true }),
        ...(visible === 'true' && { visible: true }),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Products fetch error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      imageUrl,
      images,
      categoryId,
      featured,
      visible,
      size,
      material,
      warranty,
      colors,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: price ? parseFloat(price) : null,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        imageUrl: imageUrl || null,
        images: images || [],
        categoryId: categoryId || null,
        featured: featured || false,
        visible: visible !== false,
        size: size || null,
        material: material || null,
        warranty: warranty || null,
        colors: colors || [],
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
