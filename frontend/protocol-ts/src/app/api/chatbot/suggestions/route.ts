import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/api/suggestions`, {
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
    console.error('Error fetching suggestions:', error)
    // Return fallback data for build time or when service is unavailable
    return NextResponse.json({
      success: true,
      suggestions: [
        "What is AyushBridge?",
        "How do I install AyushBridge?",
        "What terminology systems are supported?",
        "How do I authenticate with ABHA?"
      ]
    })
  }
}
