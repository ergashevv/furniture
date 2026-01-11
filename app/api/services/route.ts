import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, services })
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
    const { name, slug, description, icon, price, features, order, visible } = body

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
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
