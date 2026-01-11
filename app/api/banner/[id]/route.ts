import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    })

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    console.error('Banner fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banner' },
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
    const { title, subtitle, description, imageUrl, buttonText, buttonLink, overlay, visible, order } = body

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(buttonText !== undefined && { buttonText }),
        ...(buttonLink !== undefined && { buttonLink }),
        ...(overlay !== undefined && { overlay }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    console.error('Banner update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banner.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Banner deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}
