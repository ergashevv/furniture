import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
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
      categoryId: product.categoryId,
      featured: product.featured,
      visible: product.visible,
      size: product.size,
      material: product.material,
      warranty: product.warranty,
      colors: product.colors,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category
        ? {
            id: product.category.id,
            name: getFieldByLanguage(product.category, 'name', language),
            slug: product.category.slug,
            description: getFieldByLanguage(product.category, 'description', language),
          }
        : null,
    }))

    return NextResponse.json({ success: true, products: mappedProducts })
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
      nameUz,
      nameRu,
      slug,
      descriptionUz,
      descriptionRu,
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
        nameUz: nameUz || '',
        nameRu: nameRu || nameUz || '',
        slug,
        descriptionUz: descriptionUz || '',
        descriptionRu: descriptionRu || descriptionUz || '',
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
