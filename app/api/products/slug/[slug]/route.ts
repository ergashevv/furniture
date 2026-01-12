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
      // Professional furniture fields
      dimensions: (product as any).dimensions || null,
      weight: (product as any).weight || null,
      deliveryInfo: (product as any).deliveryInfo || null,
      specifications: (product as any).specifications || null,
      colorVariants: (product as any).colorVariants || null,
      materialDetails: (product as any).materialDetails || null,
      assemblyRequired: (product as any).assemblyRequired ?? false,
      assemblyInfo: (product as any).assemblyInfo || null,
      careInstructions: (product as any).careInstructions || null,
      capacity: (product as any).capacity || null,
      style: (product as any).style || null,
      finish: (product as any).finish || null,
      frameMaterial: (product as any).frameMaterial || null,
      cushionMaterial: (product as any).cushionMaterial || null,
      legStyle: (product as any).legStyle || null,
      seatHeight: (product as any).seatHeight || null,
      backSupport: (product as any).backSupport ?? true,
      armrests: (product as any).armrests ?? false,
      storage: (product as any).storage ?? false,
      adjustable: (product as any).adjustable ?? false,
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
