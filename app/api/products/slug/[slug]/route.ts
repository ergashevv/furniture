import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const language = getLanguageFromRequest(request)
    
    // Fetch product with all fields
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
    const productData = product as any
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
      dimensions: productData.dimensions || null,
      weight: productData.weight || null,
      deliveryInfo: productData.deliveryInfo || null,
      specifications: productData.specifications || null,
      colorVariants: productData.colorVariants || null,
      materialDetails: productData.materialDetails || null,
      assemblyRequired: productData.assemblyRequired ?? false,
      assemblyInfo: productData.assemblyInfo || null,
      careInstructions: productData.careInstructions || null,
      capacity: productData.capacity || null,
      style: productData.style || null,
      finish: productData.finish || null,
      frameMaterial: productData.frameMaterial || null,
      cushionMaterial: productData.cushionMaterial || null,
      legStyle: productData.legStyle || null,
      seatHeight: productData.seatHeight || null,
      backSupport: productData.backSupport ?? true,
      armrests: productData.armrests ?? false,
      storage: productData.storage ?? false,
      adjustable: productData.adjustable ?? false,
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
