import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
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
    const { customerName, rating, comment, location, avatar, visible, featured, order } = body

    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(customerName && { customerName }),
        ...(rating !== undefined && { rating }),
        ...(comment && { comment }),
        ...(location !== undefined && { location }),
        ...(avatar !== undefined && { avatar }),
        ...(visible !== undefined && { visible }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
