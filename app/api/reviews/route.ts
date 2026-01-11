import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLanguageFromRequest, getFieldByLanguage } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    const language = getLanguageFromRequest(request)
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const visible = searchParams.get('visible')

    const reviews = await prisma.review.findMany({
      where: {
        ...(featured === 'true' && { featured: true }),
        ...(visible === 'false' ? {} : visible === 'true' ? { visible: true } : {}),
      },
      orderBy: { order: 'asc' },
    })

    // Map reviews to include language-specific fields
    const mappedReviews = reviews.map((review) => ({
      id: review.id,
      customerName: review.customerName,
      rating: review.rating,
      comment: getFieldByLanguage(review, 'comment', language),
      location: review.location,
      avatar: review.avatar,
      visible: review.visible,
      featured: review.featured,
      order: review.order,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }))

    return NextResponse.json({ success: true, reviews: mappedReviews })
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
    const {
      customerName,
      rating,
      commentUz,
      commentRu,
      location,
      avatar,
      visible,
      featured,
      order,
    } = body

    const review = await prisma.review.create({
      data: {
        customerName,
        rating: rating || 5,
        commentUz: commentUz || '',
        commentRu: commentRu || commentUz || '',
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
