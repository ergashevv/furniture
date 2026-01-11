import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const visible = searchParams.get('visible')

    const reviews = await prisma.review.findMany({
      where: {
        ...(featured === 'true' && { featured: true }),
        ...(visible === 'true' && { visible: true }),
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, reviews })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, rating, comment, location, avatar, visible, featured, order } = body

    const review = await prisma.review.create({
      data: {
        customerName,
        rating: rating || 5,
        comment,
        location: location || null,
        avatar: avatar || null,
        visible: visible !== false,
        featured: featured || false,
        order: order || 0,
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
