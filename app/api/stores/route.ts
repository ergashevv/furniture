import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const stores = await prisma.store.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })

    // Map stores to include language-specific fields
    const mappedStores = stores.map((store) => ({
      id: store.id,
      name: getFieldByLanguage(store, 'name', language),
      address: getFieldByLanguage(store, 'address', language),
      phone: store.phone,
      email: store.email,
      workingHours: store.workingHours,
      latitude: store.latitude,
      longitude: store.longitude,
      order: store.order,
      visible: store.visible,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    }))

    return NextResponse.json({ success: true, stores: mappedStores })
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
      nameUz,
      nameRu,
      addressUz,
      addressRu,
      phone,
      email,
      workingHours,
      latitude,
      longitude,
      visible,
      order,
    } = body

    const store = await prisma.store.create({
      data: {
        nameUz: nameUz || '',
        nameRu: nameRu || nameUz || '',
        addressUz: addressUz || '',
        addressRu: addressRu || addressUz || '',
        phone: phone || null,
        email: email || null,
        workingHours: workingHours || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        visible: visible !== false,
        order: order || 0,
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
