import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/api/suggestions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch suggestions',
        suggestions: [
          "What is AyushBridge?",
          "How do I install AyushBridge?",
          "What terminology systems are supported?",
          "How do I authenticate with ABHA?"
        ]
      }
    )
  }
}
