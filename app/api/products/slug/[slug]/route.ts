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
        dimensions: true,
        weight: true,
        deliveryInfo: true,
        specifications: true,
        colorVariants: true,
        materialDetails: true,
        assemblyRequired: true,
        assemblyInfo: true,
        careInstructions: true,
        capacity: true,
        style: true,
        finish: true,
        frameMaterial: true,
        cushionMaterial: true,
        legStyle: true,
        seatHeight: true,
        backSupport: true,
        armrests: true,
        storage: true,
        adjustable: true,
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
      // Professional furniture fields
      dimensions: product.dimensions,
      weight: product.weight,
      deliveryInfo: product.deliveryInfo,
      specifications: product.specifications,
      colorVariants: product.colorVariants,
      materialDetails: product.materialDetails,
      assemblyRequired: product.assemblyRequired,
      assemblyInfo: product.assemblyInfo,
      careInstructions: product.careInstructions,
      capacity: product.capacity,
      style: product.style,
      finish: product.finish,
      frameMaterial: product.frameMaterial,
      cushionMaterial: product.cushionMaterial,
      legStyle: product.legStyle,
      seatHeight: product.seatHeight,
      backSupport: product.backSupport,
      armrests: product.armrests,
      storage: product.storage,
      adjustable: product.adjustable,
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
