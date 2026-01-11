import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stringifyJsonArray, parseJsonArray } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price: price ? parseFloat(price) : null }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(images && { images: stringifyJsonArray(images) }),
        ...(categoryId !== undefined && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(visible !== undefined && { visible }),
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

    return NextResponse.json({ success: true, product: formattedProduct })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
