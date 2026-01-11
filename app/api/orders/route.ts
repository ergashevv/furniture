import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJsonArray, stringifyJsonArray } from '@/lib/utils'

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

    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone: phone || null,
        address: address || null,
        productName: productName || null,
        description: description || null,
        designFiles: stringifyJsonArray(designFiles || []),
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
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

    // Convert JSON strings back to arrays for response
    type OrderType = (typeof orders)[0]
    const formattedOrders = orders.map((order: OrderType) => ({
      ...order,
      designFiles: parseJsonArray(order.designFiles),
    }))

    return NextResponse.json({ success: true, orders: formattedOrders })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
