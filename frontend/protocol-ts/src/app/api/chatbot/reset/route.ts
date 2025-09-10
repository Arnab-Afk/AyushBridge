import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5000'

export async function POST() {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error resetting conversation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset conversation'
      },
      { status: 500 }
    )
  }
}
