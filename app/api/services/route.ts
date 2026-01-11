import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const { searchParams } = new URL(request.url)
    const visible = searchParams.get('visible')

    const services = await prisma.service.findMany({
      where: visible === 'false' ? undefined : { visible: true },
      orderBy: { order: 'asc' },
    })

    // Map services to include language-specific fields
    const mappedServices = services.map((service) => ({
      id: service.id,
      name: getFieldByLanguage(service, 'name', language),
      slug: service.slug,
      description: getFieldByLanguage(service, 'description', language),
      icon: service.icon,
      price: service.price,
      features: service.features,
      order: service.order,
      visible: service.visible,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }))

    return NextResponse.json({ success: true, services: mappedServices })
  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameUz, nameRu, slug, descriptionUz, descriptionRu, icon, price, features, order, visible } = body

    const service = await prisma.service.create({
      data: {
        nameUz: nameUz || '',
        nameRu: nameRu || nameUz || '',
        slug,
        descriptionUz: descriptionUz || '',
        descriptionRu: descriptionRu || descriptionUz || '',
        icon: icon || null,
        price: price || null,
        features: features || [],
        order: order || 0,
        visible: visible !== false,
      },
    })

    return NextResponse.json({ success: true, service }, { status: 201 })
  } catch (error) {
    console.error('Service creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
