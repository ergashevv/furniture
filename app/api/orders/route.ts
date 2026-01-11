import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      email,
      phone,
      address,
      productName,
      description,
      designFiles,
    } = body

    // Validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required and must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Convert designFiles to array of strings (URLs)
    let designFilesArray: string[] = []
    if (designFiles) {
      if (Array.isArray(designFiles)) {
        // If it's an array of objects with url property, extract URLs
        designFilesArray = designFiles.map((file: any) => 
          typeof file === 'string' ? file : (file?.url || file?.url || '')
        ).filter((url: string) => url && url.length > 0)
      } else if (typeof designFiles === 'string') {
        designFilesArray = [designFiles]
      }
    }

    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        productName: productName?.trim() || null,
        description: description?.trim() || null,
        designFiles: designFilesArray,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error: any) {
    console.error('Order creation error:', error)
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Order with this information already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
