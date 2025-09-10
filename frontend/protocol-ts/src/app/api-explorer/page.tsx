'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Tag } from '@/components/Tag'
import { checkApiHealth as checkApiHealthStatus } from '@/lib/api-client'

const endpoints = [
  {
    name: 'NAMASTE Code Lookup',
    method: 'GET',
    path: '/fhir/CodeSystem/namaste/$lookup',
    description: 'Lookup specific NAMASTE codes with detailed information',
    params: [
      { name: 'code', type: 'string', required: true, description: 'NAMASTE code to look up' },
      { name: 'system', type: 'string', required: false, description: 'Code system URI' },
      { name: 'version', type: 'string', required: false, description: 'Version of the code system' },
      { name: 'displayLanguage', type: 'string', required: false, description: 'Language for display text (en, hi)' },
    ],
  },
  {
    name: 'ICD-11 Code Lookup',
    method: 'GET',
    path: '/fhir/CodeSystem/icd11/$lookup',
    description: 'Lookup specific ICD-11 codes with detailed information',
    params: [
      { name: 'code', type: 'string', required: true, description: 'ICD-11 code to look up' },
      { name: 'system', type: 'string', required: false, description: 'Code system URI' },
      { name: 'version', type: 'string', required: false, description: 'Version of the code system' },
      { name: 'displayLanguage', type: 'string', required: false, description: 'Language for display text (en, hi)' },
    ],
  },
  {
    name: 'NAMASTE Term Search',
    method: 'GET',
    path: '/fhir/ValueSet/namaste/$expand',
    description: 'Search and auto-complete functionality for NAMASTE terms',
    params: [
      { name: 'filter', type: 'string', required: true, description: 'Search term for auto-complete' },
      { name: 'count', type: 'number', required: false, description: 'Maximum results (default: 20, max: 100)' },
      { name: 'system', type: 'string', required: false, description: 'Filter by traditional medicine system' },
      { name: 'includeDefinition', type: 'boolean', required: false, description: 'Include concept definitions' },
    ],
  },
  {
    name: 'ICD-11 Term Search',
    method: 'GET',
    path: '/fhir/ValueSet/icd11/$expand',
    description: 'Search and auto-complete functionality for ICD-11 terms',
    params: [
      { name: 'filter', type: 'string', required: true, description: 'Search term for auto-complete' },
      { name: 'count', type: 'number', required: false, description: 'Maximum results (default: 20, max: 100)' },
      { name: 'includeDefinition', type: 'boolean', required: false, description: 'Include concept definitions' },
    ],
  },
  {
    name: 'Code Translation',
    method: 'POST',
    path: '/fhir/ConceptMap/namaste-to-icd11/$translate',
    description: 'Translate codes between different terminology systems',
    body: {
      resourceType: 'Parameters',
      parameter: [
        { name: 'code', valueCode: '' },
        { name: 'system', valueUri: 'https://ayush.gov.in/fhir/CodeSystem/namaste' },
        { name: 'target', valueUri: 'http://id.who.int/icd/release/11/mms' },
      ],
    },
    params: [],
  },
  {
    name: 'Batch Translation',
    method: 'POST',
    path: '/fhir/ConceptMap/$batch-translate',
    description: 'Perform batch operations for multiple codes simultaneously',
    body: {
      resourceType: 'Parameters',
      parameter: [
        {
          name: 'codes',
          part: [],
        },
        { name: 'source', valueUri: 'https://ayush.gov.in/fhir/CodeSystem/namaste' },
        { name: 'target', valueUri: 'http://id.who.int/icd/release/11/mms' },
      ],
    },
    params: [],
  },
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    description: 'Check the health status of the API service',
    params: [],
  },
]

export default function ApiExplorerPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [params, setParams] = useState<Record<string, string>>({})
  const [authToken, setAuthToken] = useState('')
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000')
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  // Enhanced sample data for testing with more complete examples
  const sampleData = {
    'NAMASTE Code Lookup': { 
      code: 'NAM001', 
      system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
      version: '1.0.0',
      displayLanguage: 'en'
    },
    'ICD-11 Code Lookup': { 
      code: 'TM26.0', 
      system: 'http://id.who.int/icd/release/11/mms',
      version: '2023-01',
      displayLanguage: 'en'
    },
    'NAMASTE Term Search': { 
      filter: 'amavata', 
      count: '10',
      system: 'ayurveda',
      includeDefinition: 'true'
    },
    'ICD-11 Term Search': { 
      filter: 'arthritis', 
      count: '10',
      includeDefinition: 'true'
    },
    'Code Translation': { code: 'NAM001' },
    'Batch Translation': { codes: 'NAM001,NAM002,NAM003' },
    'Health Check': {}
  }

  // Enhanced sample data loading with support for request body
  const loadSampleData = () => {
    const samples = sampleData[selectedEndpoint.name as keyof typeof sampleData]
    if (samples) {
      setParams(samples as Record<string, string>)
      
      // For POST endpoints, populate the request body with sample data
      if (selectedEndpoint.method === 'POST') {
        if (selectedEndpoint.body) {
          const bodyCopy = JSON.parse(JSON.stringify(selectedEndpoint.body))
          
          if (selectedEndpoint.name === 'Code Translation') {
            const translationSample = samples as { code?: string }
            if (translationSample.code) {
              bodyCopy.parameter[0].valueCode = translationSample.code
            }
          } else if (selectedEndpoint.name === 'Batch Translation') {
            const batchSample = samples as { codes?: string }
            if (batchSample.codes) {
              const codes = batchSample.codes.split(',').map((c: string) => c.trim())
              bodyCopy.parameter[0].part = codes.map((code: string) => ({ name: 'code', valueCode: code }))
            }
          }
          
          setRequestBody(JSON.stringify(bodyCopy, null, 2))
        }
      }
    }
  }
  
  // Fill all fields with default values
  const fillAllFields = () => {
    // Set default base URL if empty
    if (!baseUrl) {
      setBaseUrl('http://localhost:3000')
    }
    
    // Set sample auth token if empty
    if (!authToken) {
      setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW1wbGUtdXNlciIsIm5hbWUiOiJBQkhBIFVzZXIiLCJpYXQiOjE2MzA0NjgwMDB9.sample-token')
    }
    
    // Load sample data for the current endpoint
    loadSampleData()
  }

  const handleParamChange = (name: string, value: string) => {
    setParams(prev => ({ ...prev, [name]: value }))
  }

  const buildUrl = () => {
    let url = baseUrl + selectedEndpoint.path
    const queryParams = new URLSearchParams()

    selectedEndpoint.params.forEach(param => {
      if (params[param.name]) {
        queryParams.append(param.name, params[param.name])
      }
    })

    if (queryParams.toString()) {
      url += '?' + queryParams.toString()
    }

    return url
  }

  const checkApiHealth = async () => {
    setApiStatus('checking')
    const isHealthy = await checkApiHealthStatus(baseUrl)
    setApiStatus(isHealthy ? 'online' : 'offline')
    console.log(`API is ${isHealthy ? 'online' : 'offline'}`)
  }

  // Check API status on mount and when baseUrl changes
  useEffect(() => {
    checkApiHealth()
  }, [baseUrl])

  const sendRequest = async () => {
    setLoading(true)
    setResponse('')

    try {
      const url = buildUrl()
      const path = url.replace(baseUrl, '')
      const headers: Record<string, string> = {
        'Accept': 'application/fhir+json',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      let body: string | undefined
      if (selectedEndpoint.method === 'POST') {
        headers['Content-Type'] = 'application/fhir+json'
        if (requestBody) {
          body = requestBody
        } else if (selectedEndpoint.body) {
          // Fill in the body with params
          const bodyCopy = JSON.parse(JSON.stringify(selectedEndpoint.body))
          if (selectedEndpoint.name === 'Code Translation' && params.code) {
            bodyCopy.parameter[0].valueCode = params.code
          } else if (selectedEndpoint.name === 'Batch Translation' && params.codes) {
            const codes = params.codes.split(',').map((c: string) => c.trim())
            bodyCopy.parameter[0].part = codes.map((code: string) => ({ name: 'code', valueCode: code }))
          }
          body = JSON.stringify(bodyCopy, null, 2)
        }
      }

      // Log request details to help with debugging
      console.log('Sending request to:', url)
      console.log('Headers:', headers)
      if (body) console.log('Request body:', body)

      // Create a timestamp to measure response time
      const startTime = new Date().getTime()

      const response = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        body,
        // Add these options to handle CORS properly
        mode: 'cors',
        credentials: 'include',
      })

      const endTime = new Date().getTime()
      const responseTime = endTime - startTime

      let responseText = await response.text()
      let formattedResponse = `HTTP ${response.status} ${response.statusText}\n`
      formattedResponse += `Time: ${responseTime}ms\n`
      
      // Add response headers for debugging
      formattedResponse += '\nResponse Headers:\n'
      response.headers.forEach((value, key) => {
        formattedResponse += `${key}: ${value}\n`
      })
      
      // Format JSON response if possible
      try {
        if (responseText && (responseText.trim().startsWith('{') || responseText.trim().startsWith('['))) {
          const jsonData = JSON.parse(responseText)
          responseText = JSON.stringify(jsonData, null, 2)
        }
      } catch (e) {
        // If parsing fails, leave as plain text
      }
      
      formattedResponse += `\nResponse Body:\n${responseText}`
      setResponse(formattedResponse)
      
      // Refresh API status if we get an error
      if (!response.ok && response.status >= 500) {
        checkApiHealth()
      }
    } catch (error) {
      console.error('Request error:', error)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Always check API health on connection errors
      checkApiHealth()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">API Explorer</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fillAllFields} className="text-xs py-1 mr-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20">
            Fill All Sample Data
          </Button>
          
          <span className="text-sm">API Status:</span>
          {apiStatus === 'checking' && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
              Checking...
            </span>
          )}
          {apiStatus === 'online' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
              Online
            </span>
          )}
          {apiStatus === 'offline' && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
              Offline
            </span>
          )}
          <Button variant="outline" onClick={checkApiHealth} className="text-xs py-1">
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Configuration Panel */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
          
          {/* Base URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Base URL</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
                />
                <div className="absolute left-3 top-2.5 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
              </div>
              <Button variant="outline" onClick={checkApiHealth}>
                Check
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              {['http://localhost:3000', 'https://api.ayushbridge.in'].map((url) => (
                <button
                  key={url}
                  onClick={() => setBaseUrl(url)}
                  className="px-2 py-1 text-xs bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700"
                >
                  {url.includes('localhost') ? 'Local' : 'Production'}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Token */}
          <div>
            <label className="block text-sm font-medium mb-2">Authorization Token (Bearer)</label>
            <div className="relative">
              <input
                type={authToken && authToken.length > 0 ? 'password' : 'text'}
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter your ABHA token"
                className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
              />
              <div className="absolute left-3 top-2.5 text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW1wbGUtdXNlciIsIm5hbWUiOiJBQkhBIFVzZXIiLCJpYXQiOjE2MzA0NjgwMDB9.sample-token')}
                className="px-2 py-1 text-xs bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700"
              >
                Use Sample Token
              </button>
            </div>
          </div>
        </div>

        {/* Endpoint Selection */}
        <div id="endpoint-selection">
          <h2 className="text-xl font-semibold mb-4">Endpoint Selection</h2>
          <div className="grid gap-4">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.name}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedEndpoint.name === endpoint.name
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400'
                }`}
                onClick={() => {
                  setSelectedEndpoint(endpoint)
                  setParams({})
                  setRequestBody('')
                  setResponse('')
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tag variant="small">{endpoint.method}</Tag>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parameters */}
        {selectedEndpoint.params.length > 0 && (
          <div id="parameters">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Parameters</h2>
              {sampleData[selectedEndpoint.name as keyof typeof sampleData] && (
                <Button variant="outline" onClick={loadSampleData} className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20">
                  Load Sample Data
                </Button>
              )}
            </div>
            <div className="space-y-4 border border-zinc-200 dark:border-zinc-700 p-4 rounded-md">
              {selectedEndpoint.params.map((param) => (
                <div key={param.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      {param.name} {param.required && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-xs text-zinc-500">{param.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    {param.type === 'boolean' ? (
                      <select
                        value={params[param.name] || ''}
                        onChange={(e) => handleParamChange(param.name, e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        <option value="">Select...</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={params[param.name] || ''}
                        onChange={(e) => handleParamChange(param.name, e.target.value)}
                        placeholder={`Enter ${param.name}...`}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
                      />
                    )}
                    {param.name === 'code' && (
                      <div className="mt-1 text-xs">
                        <span className="text-zinc-500">Example: </span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline dark:text-blue-400" 
                          onClick={() => handleParamChange(param.name, selectedEndpoint.name.includes('NAMASTE') ? 'NAM001' : 'TM26.0')}
                        >
                          {selectedEndpoint.name.includes('NAMASTE') ? 'NAM001' : 'TM26.0'}
                        </span>
                      </div>
                    )}
                    {param.name === 'filter' && (
                      <div className="mt-1 text-xs">
                        <span className="text-zinc-500">Examples: </span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline mr-2 dark:text-blue-400" 
                          onClick={() => handleParamChange(param.name, 'amavata')}
                        >
                          amavata
                        </span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline dark:text-blue-400" 
                          onClick={() => handleParamChange(param.name, 'arthritis')}
                        >
                          arthritis
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {selectedEndpoint.method === 'POST' && (
          <div id="request">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Request Body</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (selectedEndpoint.body) {
                      const formattedBody = JSON.stringify(selectedEndpoint.body, null, 2);
                      setRequestBody(formattedBody);
                    }
                  }}
                  className="text-sm"
                >
                  Reset to Default
                </Button>
                <Button 
                  variant="outline"
                  onClick={loadSampleData}
                  className="text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
                >
                  Load Sample Data
                </Button>
              </div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-md p-2 bg-zinc-50 dark:bg-zinc-900">
              <textarea
                value={requestBody || (selectedEndpoint.body ? JSON.stringify(selectedEndpoint.body, null, 2) : '')}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder="Enter JSON request body"
                rows={14}
                className="w-full px-3 py-2 font-mono text-sm bg-transparent outline-none resize-y"
              />
            </div>
            {selectedEndpoint.name === 'Code Translation' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h3 className="text-sm font-medium mb-2">Quick Edit Code Translation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">NAMASTE Code</label>
                    <input
                      type="text"
                      value={params.code || ''}
                      onChange={(e) => {
                        handleParamChange('code', e.target.value)
                        // Also update the request body
                        try {
                          if (requestBody) {
                            const body = JSON.parse(requestBody)
                            body.parameter[0].valueCode = e.target.value
                            setRequestBody(JSON.stringify(body, null, 2))
                          }
                        } catch (e) {
                          console.error('Failed to update request body:', e)
                        }
                      }}
                      placeholder="Enter NAMASTE code"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send Request */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center">
            <span className="mr-3 font-medium text-zinc-700 dark:text-zinc-300">Ready to test?</span>
            <Button 
              onClick={sendRequest} 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Send Request
                </span>
              )}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setResponse('')} className="text-sm">
              Clear Response
            </Button>
            <Button 
              variant="outline" 
              onClick={fillAllFields} 
              className="text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
            >
              Fill Sample Data
            </Button>
          </div>
        </div>

        {/* Response */}
        {response && (
          <div id="response" className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="mr-2">Response</span>
                {response.includes('HTTP 200') && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Success
                  </span>
                )}
                {response.includes('HTTP 4') && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium">
                    Client Error
                  </span>
                )}
                {response.includes('HTTP 5') && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                    Server Error
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      // Try to parse the response to format it
                      const responseBodyStart = response.indexOf('\nResponse Body:')
                      if (responseBodyStart !== -1) {
                        const responseBody = response.substring(responseBodyStart + 15).trim()
                        try {
                          const json = JSON.parse(responseBody)
                          const formatted = JSON.stringify(json, null, 2)
                          const formattedResponse = response.substring(0, responseBodyStart + 15) + '\n' + formatted
                          setResponse(formattedResponse)
                        } catch (e) {
                          // Not valid JSON, ignore formatting
                        }
                      }
                    } catch (e) {
                      console.error('Error formatting response:', e)
                    }
                  }}
                  className="text-sm"
                >
                  Format
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="text-sm"
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setResponse('')}
                  className="text-sm"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="bg-zinc-900 text-white overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                {response}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
