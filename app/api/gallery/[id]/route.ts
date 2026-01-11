import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, videoUrl, category, featured, visible, order } =
      body

    const item = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(category !== undefined && { category }),
        ...(featured !== undefined && { featured }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Gallery item update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.galleryItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery item deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    )
  }
}
