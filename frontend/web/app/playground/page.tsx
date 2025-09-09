"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const endpoints = [
  "Terminology Lookup",
  "Code Translation", 
  "FHIR Bundle Upload",
  "Search NAMASTE",
  "ICD-11 Mapping",
  "Condition Create",
  "Bundle Validation"
]

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("Terminology Lookup")
  const [authToken, setAuthToken] = useState("")
  const [requestParams, setRequestParams] = useState({
    url: "http://ayush-gov.in/namaste",
    code: "AYU0001",
    version: ""
  })
  const [response, setResponse] = useState("API Response will be displayed here")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendRequest = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResponse(`{
  "resourceType": "CodeSystem",
  "id": "namaste-ayurveda",
  "url": "http://ayush-gov.in/namaste",
  "version": "1.0.0",
  "name": "NAMASTE_Ayurveda",
  "title": "NAMASTE Ayurveda Terminology",
  "status": "active",
  "code": "AYU0001",
  "display": "Vata Dosha Imbalance",
  "definition": "Constitutional imbalance characterized by excess Vata dosha",
  "concept": [
    {
      "code": "AYU0001",
      "display": "Vata Dosha Imbalance",
      "definition": "Excess Vata causing dryness, irregular digestion, anxiety",
      "property": [
        {
          "code": "icd11-mapping",
          "valueString": "MB23.Z Other specified disorders of autonomic nervous system"
        }
      ]
    }
  ]
}`)
      setIsLoading(false)
    }, 1500)
  }

  const clearAll = () => {
    setRequestParams({
      url: "",
      code: "",
      version: ""
    })
    setAuthToken("")
    setResponse("API Response will be displayed here")
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-900 rounded"></div>
                <span className="text-lg font-semibold text-gray-900">AyushBridge</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="/bundles" className="text-gray-600 hover:text-gray-900 transition-colors">Bundles</a>
                <a href="/playground" className="text-indigo-600 font-medium">API Playground</a>
                <a href="/documentation" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Playground</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore and test AyushBridge API endpoints interactively, bridging traditional Indian medicine with modern healthcare.
          </p>
        </div>

        {/* API Testing Interface */}
        <Card className="bg-white border border-gray-200 mb-12">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Side - Request Configuration */}
              <div className="space-y-6">
                {/* Endpoint Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Endpoint</label>
                  <select 
                    value={selectedEndpoint}
                    onChange={(e) => setSelectedEndpoint(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {endpoints.map((endpoint) => (
                      <option key={endpoint} value={endpoint}>{endpoint}</option>
                    ))}
                  </select>
                </div>

                {/* Authentication */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Authentication</label>
                  <input
                    type="text"
                    placeholder="ABHA Token (Optional)"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Request Parameters */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-900">Request Parameters</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAll}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="URL"
                      value={requestParams.url}
                      onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    
                    <input
                      type="text"
                      placeholder="Code"
                      value={requestParams.code}
                      onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    
                    <input
                      type="text"
                      placeholder="Version"
                      value={requestParams.version}
                      onChange={(e) => setRequestParams(prev => ({...prev, version: e.target.value}))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Send Request Button */}
                <Button 
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Request...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>▶</span>
                      <span>Send Request</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Right Side - Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900">Response</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyResponse}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </Button>
                </div>
                
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 h-96 overflow-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {response}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Complete API reference with endpoints, parameters, and examples.
              </p>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Code Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Implementation examples in multiple programming languages.
              </p>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Browse Examples
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Get help with integration and troubleshooting issues.
              </p>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Get Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2024 AyushBridge. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
