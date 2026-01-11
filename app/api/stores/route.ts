import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const stores = await prisma.store.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, stores })
  } catch (error) {
    console.error('Stores fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      address,
      phone,
      email,
      workingHours,
      latitude,
      longitude,
      order,
      visible,
    } = body

    const store = await prisma.store.create({
      data: {
        name,
        address,
        phone: phone || null,
        email: email || null,
        workingHours: workingHours || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        order: order || 0,
        visible: visible !== false,
      },
    })

    return NextResponse.json({ success: true, store }, { status: 201 })
  } catch (error) {
    console.error('Store creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create store' },
      { status: 500 }
    )
  }
}
