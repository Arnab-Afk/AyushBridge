import { NextRequest, NextResponse } from 'next/server'

interface GeneratedCode {
  codeSystem: string
  code: string
  displayName: string
  confidence: number
}

interface GenerationRequest {
  clinicalDescription: string
}

interface GenerationResponse {
  clinicalDescription: string
  codes: GeneratedCode[]
}

// Mock code generation function - replace with actual AI/ML service
function generateMockCodes(description: string): GeneratedCode[] {
  const keywords = description.toLowerCase()
  const codes: GeneratedCode[] = []

  // Simple keyword-based mock logic
  if (keywords.includes('chest pain') || keywords.includes('breathless') || keywords.includes('respiratory')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "AB45.6", 
      displayName: "Respiratory infection, unspecified",
      confidence: 95
    })
    
    codes.push({
      codeSystem: "NAMASTE",
      code: "RES-001",
      displayName: "Acute respiratory distress", 
      confidence: 88
    })
  }

  if (keywords.includes('cough')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "CD78.9",
      displayName: "Cough, unspecified",
      confidence: 75
    })
  }

  if (keywords.includes('fever')) {
    codes.push({
      codeSystem: "ICD-11", 
      code: "MG30.0",
      displayName: "Fever, unspecified",
      confidence: 85
    })
  }

  if (keywords.includes('pain')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "MG30.5", 
      displayName: "Pain, unspecified",
      confidence: 80
    })
  }

  if (keywords.includes('headache')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "8A80.0",
      displayName: "Headache",
      confidence: 92
    })
  }

  if (keywords.includes('diabetes')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "5A10",
      displayName: "Type 2 diabetes mellitus",
      confidence: 98
    })
    
    codes.push({
      codeSystem: "NAMASTE", 
      code: "END-002",
      displayName: "Diabetes management",
      confidence: 94
    })
  }

  if (keywords.includes('hypertension') || keywords.includes('high blood pressure')) {
    codes.push({
      codeSystem: "ICD-11",
      code: "BA00",
      displayName: "Essential hypertension", 
      confidence: 96
    })
  }

  // Default codes if no specific matches
  if (codes.length === 0) {
    codes.push({
      codeSystem: "ICD-11",
      code: "MG30.Z",
      displayName: "General symptoms, unspecified",
      confidence: 70
    })
    
    codes.push({
      codeSystem: "NAMASTE",
      code: "GEN-001", 
      displayName: "General assessment",
      confidence: 65
    })
  }

  return codes
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json()
    
    if (!body.clinicalDescription || !body.clinicalDescription.trim()) {
      return NextResponse.json(
        { error: 'Clinical description is required' },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const codes = generateMockCodes(body.clinicalDescription)
    
    const response: GenerationResponse = {
      clinicalDescription: body.clinicalDescription,
      codes
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error generating codes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Code generation API endpoint' },
    { status: 200 }
  )
}
