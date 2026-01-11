import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visible = searchParams.get('visible')
    const featured = searchParams.get('featured')

    const items = await prisma.galleryItem.findMany({
      where: {
        ...(visible === 'true' && { visible: true }),
        ...(featured === 'true' && { featured: true }),
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Gallery fetch error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      videoUrl,
      category,
      featured,
      visible,
      order,
    } = body

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
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
