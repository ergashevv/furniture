import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Get specific setting
      const setting = await prisma.settings.findUnique({
        where: { key },
      })

      if (!setting) {
        return NextResponse.json(
          { success: false, error: 'Setting not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, setting })
    } else {
      // Get all settings
      const settings = await prisma.settings.findMany({
        orderBy: { key: 'asc' },
      })

      // Convert to key-value object
      const settingsMap: Record<string, string> = {}
      settings.forEach((setting) => {
        settingsMap[setting.key] = setting.value
      })

      return NextResponse.json({ success: true, settings: settingsMap })
    }
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      )
    }

    // Upsert setting (create or update)
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })

    return NextResponse.json({ success: true, setting }, { status: 201 })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}
