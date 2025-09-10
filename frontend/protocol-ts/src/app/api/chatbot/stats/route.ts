import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export const runtime = 'edge'

export async function GET() {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging during build
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    // Return fallback data for build time or when service is unavailable
    return NextResponse.json({
      success: true,
      stats: {
        is_initialized: false,
        total_chunks: 0,
        error: 'Service unavailable during build'
      }
    })
  }
}
