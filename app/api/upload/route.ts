import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    if (!blobToken) {
      return NextResponse.json(
        { success: false, error: 'Blob storage not configured' },
        { status: 500 }
      )
    }

    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: 'public',
        token: blobToken,
      })
      return blob.url
    })

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({ success: true, urls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
