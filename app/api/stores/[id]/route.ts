import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    })

    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, store })
  } catch (error) {
    console.error('Store fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
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
      address,
      phone,
      email,
      workingHours,
      latitude,
      longitude,
      order,
      visible,
    } = body

    const store = await prisma.store.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(workingHours !== undefined && { workingHours }),
        ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
        ...(order !== undefined && { order }),
        ...(visible !== undefined && { visible }),
      },
    })

    return NextResponse.json({ success: true, store })
  } catch (error) {
    console.error('Store update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.store.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Store deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}
