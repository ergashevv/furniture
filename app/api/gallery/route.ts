import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const visible = searchParams.get('visible')

    const items = await prisma.galleryItem.findMany({
      where: {
        ...(featured === 'true' && { featured: true }),
        ...(visible === 'true' && { visible: true }),
      },
      orderBy: { order: 'asc' },
    })

    // Map items to include language-specific fields
    const mappedItems = items.map((item) => ({
      id: item.id,
      title: getFieldByLanguage(item, 'title', language),
      description: getFieldByLanguage(item, 'description', language),
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      category: item.category,
      featured: item.featured,
      visible: item.visible,
      order: item.order,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))

    return NextResponse.json({ success: true, items: mappedItems })
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      titleUz,
      titleRu,
      descriptionUz,
      descriptionRu,
      imageUrl,
      videoUrl,
      category,
      featured,
      visible,
      order,
    } = body

    const item = await prisma.galleryItem.create({
      data: {
        titleUz: titleUz || '',
        titleRu: titleRu || titleUz || '',
        descriptionUz: descriptionUz || null,
        descriptionRu: descriptionRu || descriptionUz || null,
        imageUrl,
        videoUrl: videoUrl || null,
        category: category || null,
        featured: featured || false,
        visible: visible !== false,
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, item }, { status: 201 })
  } catch (error) {
    console.error('Gallery item creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    )
  }
}
