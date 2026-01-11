import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray, stringifyJsonArray } from '@/lib/utils'

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

    // Convert JSON strings back to arrays for response
    type ProductType = (typeof products)[0]
    const formattedProducts = products.map((product: ProductType) => ({
      ...product,
      images: parseJsonArray(product.images),
    }))

    return NextResponse.json({ success: true, products: formattedProducts })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
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
      imageUrl,
      images,
      categoryId,
      featured,
      visible,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: price ? parseFloat(price) : null,
        imageUrl: imageUrl || null,
        images: stringifyJsonArray(images || []),
        categoryId: categoryId || null,
        featured: featured || false,
        visible: visible !== false,
      },
      include: {
        category: true,
      },
    })

    // Convert JSON string back to array for response
    const formattedProduct = {
      ...product,
      images: parseJsonArray(product.images),
    }

    return NextResponse.json({ success: true, product: formattedProduct }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
