import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '4')

    if (!productId && !categoryId) {
      return NextResponse.json(
        { success: false, error: 'productId or categoryId is required' },
        { status: 400 }
      )
    }

    let whereClause: any = { visible: true }

    // If productId is provided, get the product first to find its category
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true },
      })

      if (product?.categoryId) {
        whereClause.categoryId = product.categoryId
        // Exclude the current product
        whereClause.id = { not: productId }
      }
    } else if (categoryId) {
      whereClause.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      take: limit,
      orderBy: [
        { featured: 'desc' }, // Featured products first
        { createdAt: 'desc' }, // Then by creation date
      ],
    })

    // Convert JSON strings back to arrays for response
    type ProductType = (typeof products)[0]
    const formattedProducts = products.map((product: ProductType) => ({
      ...product,
      images: parseJsonArray(product.images),
    }))

    return NextResponse.json({ success: true, products: formattedProducts })
  } catch (error) {
    console.error('Related products fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}
