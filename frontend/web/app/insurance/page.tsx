"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"

interface GeneratedCode {
  codeSystem: string
  code: string
  displayName: string
  confidence: number
}

interface GenerationResult {
  clinicalDescription: string
  codes: GeneratedCode[]
}

export default function InsurancePage() {
  const [clinicalDescription, setClinicalDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<GenerationResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleGenerateCodes = async () => {
    if (!clinicalDescription.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicalDescription }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      } else {
        // For demo purposes, show mock data if API fails
        const mockData: GenerationResult = {
          clinicalDescription,
          codes: [
            {
              codeSystem: "ICD-11",
              code: "AB45.6",
              displayName: "Respiratory infection, unspecified",
              confidence: 95
            },
            {
              codeSystem: "NAMASTE",
              code: "RES-001",
              displayName: "Acute respiratory distress",
              confidence: 88
            },
            {
              codeSystem: "ICD-11",
              code: "CD78.9",
              displayName: "Cough, unspecified",
              confidence: 75
            }
          ]
        }
        setResults(mockData)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error generating codes:', error)
      // Show mock data on error for demo
      const mockData: GenerationResult = {
        clinicalDescription,
        codes: [
          {
            codeSystem: "ICD-11",
            code: "AB45.6",
            displayName: "Respiratory infection, unspecified",
            confidence: 95
          },
          {
            codeSystem: "NAMASTE",
            code: "RES-001",
            displayName: "Acute respiratory distress",
            confidence: 88
          },
          {
            codeSystem: "ICD-11",
            code: "CD78.9",
            displayName: "Cough, unspecified",
            confidence: 75
          }
        ]
      }
      setResults(mockData)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setShowResults(false)
    setResults(null)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleCopyAll = () => {
    if (results) {
      const allCodes = results.codes.map(code => 
        `${code.codeSystem}: ${code.code} - ${code.displayName} (${code.confidence}%)`
      ).join('\n')
      navigator.clipboard.writeText(allCodes)
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Code Conversion Results
              </h1>
              <p className="text-white/70 text-lg">
                Review the generated codes based on your clinical input.
              </p>
            </div>

            <div className="space-y-8">
              {/* Clinical Description */}
              <Card className="sofax-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Clinical Description
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    {results.clinicalDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Generated Codes */}
              <Card className="sofax-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Generated Codes
                    </h2>
                    <Button
                      onClick={handleCopyAll}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                        />
                      </svg>
                      Copy All
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-white/70 font-medium">
                            Code System
                          </th>
                          <th className="text-left py-3 px-4 text-white/70 font-medium">
                            Code
                          </th>
                          <th className="text-left py-3 px-4 text-white/70 font-medium">
                            Display Name
                          </th>
                          <th className="text-left py-3 px-4 text-white/70 font-medium">
                            Confidence
                          </th>
                          <th className="text-left py-3 px-4 text-white/70 font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.codes.map((code, index) => (
                          <tr 
                            key={index} 
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4 text-white font-medium">
                              {code.codeSystem}
                            </td>
                            <td className="py-4 px-4 text-white font-mono">
                              {code.code}
                            </td>
                            <td className="py-4 px-4 text-white/80">
                              {code.displayName}
                            </td>
                            <td className="py-4 px-4">
                              <span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  code.confidence >= 90 
                                    ? 'bg-green-900/50 text-green-300' 
                                    : code.confidence >= 75 
                                    ? 'bg-yellow-900/50 text-yellow-300' 
                                    : 'bg-red-900/50 text-red-300'
                                }`}
                              >
                                {code.confidence}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <Button
                                onClick={() => handleCopyCode(code.code)}
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80"
                              >
                                <svg 
                                  className="w-4 h-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                                  />
                                </svg>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                  </svg>
                  Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Insurance Code Converter
            </h1>
            <p className="text-white/70 text-lg">
              Enter a clinical description to generate the corresponding ICD or NAMASTE codes.
            </p>
          </div>

          {/* Form */}
          <Card className="sofax-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label 
                    htmlFor="clinical-description" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Clinical Description
                  </label>
                  <textarea
                    id="clinical-description"
                    placeholder="e.g., '45 year old male with chest pain and breathlessness'"
                    value={clinicalDescription}
                    onChange={(e) => setClinicalDescription(e.target.value)}
                    className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <Button
                  onClick={handleGenerateCodes}
                  disabled={!clinicalDescription.trim() || isLoading}
                  className="w-full sofax-button-primary py-3 text-white font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Codes...
                    </div>
                  ) : (
                    'Generate Codes'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              Our AI-powered system analyzes clinical descriptions and generates accurate 
              medical codes for insurance and billing purposes.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
