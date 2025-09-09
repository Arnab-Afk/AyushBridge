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
      body: JSON.stringify(body)
    })
    
    const data = await chatbotResponse.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error proxying to chatbot API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to AyushBridge AI service',
        message: error.message
      },
      { status: 500 }
    )
  }
}
