import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const { searchParams } = new URL(request.url)
    const includeHidden = searchParams.get('includeHidden') === 'true'

    const banners = await prisma.banner.findMany({
      where: includeHidden ? undefined : { visible: true },
      orderBy: { order: 'asc' },
    })

    // Map banners to include language-specific fields
    const mappedBanners = banners.map((banner) => ({
      id: banner.id,
      title: getFieldByLanguage(banner, 'title', language),
      subtitle: getFieldByLanguage(banner, 'subtitle', language),
      description: getFieldByLanguage(banner, 'description', language),
      imageUrl: banner.imageUrl,
      buttonText: getFieldByLanguage(banner, 'buttonText', language),
      buttonLink: banner.buttonLink,
      overlay: banner.overlay,
      visible: banner.visible,
      order: banner.order,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    }))

    return NextResponse.json({ success: true, banners: mappedBanners })
  } catch (error) {
    console.error('Banner fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
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
      subtitleUz,
      subtitleRu,
      descriptionUz,
      descriptionRu,
      imageUrl,
      buttonTextUz,
      buttonTextRu,
      buttonLink,
      overlay,
      visible,
      order,
    } = body

    const banner = await prisma.banner.create({
      data: {
        titleUz: titleUz || '',
        titleRu: titleRu || titleUz || '',
        subtitleUz: subtitleUz || null,
        subtitleRu: subtitleRu || subtitleUz || null,
        descriptionUz: descriptionUz || null,
        descriptionRu: descriptionRu || descriptionUz || null,
        imageUrl,
        buttonTextUz: buttonTextUz || null,
        buttonTextRu: buttonTextRu || buttonTextUz || null,
        buttonLink: buttonLink || null,
        overlay: overlay || 0.5,
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
