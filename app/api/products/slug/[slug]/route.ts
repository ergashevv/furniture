import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const language = getLanguageFromRequest(request)
    
    // Use select to only fetch fields that exist in database
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
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
        categoryId: true,
        featured: true,
        visible: true,
        size: true,
        material: true,
        warranty: true,
        colors: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            nameUz: true,
            nameRu: true,
            slug: true,
            descriptionUz: true,
            descriptionRu: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Map product to include language-specific fields
    const mappedProduct = {
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
      size: product.size,
      material: product.material,
      warranty: product.warranty,
      colors: product.colors,
      // New fields will be null until database migration is complete
      dimensions: null,
      weight: null,
      deliveryInfo: null,
      specifications: null,
      category: product.category
        ? {
            id: product.category.id,
            name: getFieldByLanguage(product.category, 'name', language),
            slug: product.category.slug,
          }
        : null,
    }

    return NextResponse.json({ success: true, product: mappedProduct })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
