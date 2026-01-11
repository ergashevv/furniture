import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    })

    return NextResponse.json({ success: true, message: contactMessage }, { status: 201 })
  } catch (error) {
    console.error('Contact message creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const read = searchParams.get('read')

    const messages = await prisma.contactMessage.findMany({
      where: read ? { read: read === 'true' } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error('Contact messages fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
