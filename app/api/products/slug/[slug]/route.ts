import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Convert JSON string back to array for response
    const formattedProduct = {
      ...product,
      images: parseJsonArray(product.images),
    }

    return NextResponse.json({ success: true, product: formattedProduct })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
