import { NextRequest, NextResponse } from 'next/server'
import { getRecentUrls } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const urls = await getRecentUrls(Math.min(limit, 50)) // Cap at 50

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const urlsWithShortUrl = urls.map(url => ({
      ...url,
      shortUrl: `${baseUrl}/${url.custom_alias || url.short_code}`,
    }))

    return NextResponse.json({
      success: true,
      data: urlsWithShortUrl,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
