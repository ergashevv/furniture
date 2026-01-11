import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeHidden = searchParams.get('includeHidden') === 'true'

    const banners = await prisma.banner.findMany({
      where: includeHidden ? {} : { visible: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, banners })
  } catch (error) {
    console.error('Banners fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description, imageUrl, buttonLink, buttonText, visible, order } = body

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        imageUrl,
        buttonLink: buttonLink || null,
        buttonText: buttonText || null,
        visible: visible !== false,
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, banner }, { status: 201 })
  } catch (error) {
    console.error('Banner creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
