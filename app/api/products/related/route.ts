import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
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

    // Use select to only fetch fields that exist in database
    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        nameUz: true,
        nameRu: true,
        slug: true,
        descriptionUz: true,
        descriptionRu: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
        images: true,
        featured: true,
        visible: true,
        category: {
          select: {
            id: true,
            nameUz: true,
            nameRu: true,
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: [
        { featured: 'desc' }, // Featured products first
        { createdAt: 'desc' }, // Then by creation date
      ],
    })

    // Map products to include language-specific fields
    const mappedProducts = products.map((product) => ({
      id: product.id,
      name: getFieldByLanguage(product, 'name', language),
      slug: product.slug,
      description: getFieldByLanguage(product, 'description', language),
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      images: product.images,
      featured: product.featured,
      visible: product.visible,
      category: product.category
        ? {
            id: product.category.id,
            name: getFieldByLanguage(product.category, 'name', language),
            slug: product.category.slug,
          }
        : null,
    }))

    return NextResponse.json({ success: true, products: mappedProducts })
  } catch (error) {
    console.error('Related products fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}
