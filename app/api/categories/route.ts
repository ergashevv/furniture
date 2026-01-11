import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map categories to include language-specific fields
    const mappedCategories = categories.map((cat) => ({
      id: cat.id,
      name: getFieldByLanguage(cat, 'name', language),
      slug: cat.slug,
      description: getFieldByLanguage(cat, 'description', language),
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      _count: cat._count,
    }))

    return NextResponse.json({ success: true, categories: mappedCategories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameUz, nameRu, slug, descriptionUz, descriptionRu } = body

    const category = await prisma.category.create({
      data: {
        nameUz: nameUz || '',
        nameRu: nameRu || nameUz || '',
        slug,
        descriptionUz: descriptionUz || null,
        descriptionRu: descriptionRu || descriptionUz || null,
      },
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
