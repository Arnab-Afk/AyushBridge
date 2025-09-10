import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const chatbotResponse = await fetch(`${CHATBOT_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      // Add timeout to prevent hanging during build
      signal: AbortSignal.timeout(10000)
    })

    if (!chatbotResponse.ok) {
      throw new Error(`HTTP ${chatbotResponse.status}`)
    }

    const data = await chatbotResponse.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error proxying to chatbot API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to AyushBridge AI service',
        message: 'The chatbot service is currently unavailable. Please try again later.',
        answer: 'I apologize, but I\'m currently unable to connect to the AyushBridge AI service. Please check that the service is running and try again.'
      },
      { status: 503 }
    )
  }
}
