import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch chatbot statistics',
        stats: {
          is_initialized: false,
          total_chunks: 0,
          error: 'Connection error'
        }
      }
    )
  }
}
