'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Tag } from '@/components/Tag'

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
  const [baseUrl, setBaseUrl] = useState('https://api.ayushbridge.in')
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Sample data for testing
  const sampleData = {
    'NAMASTE Code Lookup': { code: 'NAM001' },
    'ICD-11 Code Lookup': { code: 'TM26.0' },
    'NAMASTE Term Search': { filter: 'amavata' },
    'ICD-11 Term Search': { filter: 'arthritis' },
    'Code Translation': { code: 'NAM001' },
    'Batch Translation': { codes: 'NAM001,NAM002,NAM003' },
  }

  const loadSampleData = () => {
    const samples = sampleData[selectedEndpoint.name as keyof typeof sampleData]
    if (samples) {
      setParams(samples)
    }
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

  const sendRequest = async () => {
    setLoading(true)
    setResponse('')

    try {
      const url = buildUrl()
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

      const response = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        body,
      })

      const responseText = await response.text()
      setResponse(`HTTP ${response.status} ${response.statusText}\n\n${responseText}`)
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Explorer</h1>

      <div className="space-y-8">
        {/* Base URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
          />
        </div>

        {/* Auth Token */}
        <div>
          <label className="block text-sm font-medium mb-2">Authorization Token (Bearer)</label>
          <input
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Enter your ABHA token"
            className="w-full px-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
          />
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
                <Button variant="outline" onClick={loadSampleData}>
                  Load Sample Data
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {selectedEndpoint.params.map((param) => (
                <div key={param.name}>
                  <label className="block text-sm font-medium mb-1">
                    {param.name} {param.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    value={params[param.name] || ''}
                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                    placeholder={param.description}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md dark:border-zinc-600 dark:bg-zinc-800"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {selectedEndpoint.method === 'POST' && (
          <div id="request">
            <h2 className="text-xl font-semibold mb-4">Request Body</h2>
            <textarea
              value={requestBody || (selectedEndpoint.body ? JSON.stringify(selectedEndpoint.body, null, 2) : '')}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="Enter JSON request body"
              rows={10}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md font-mono text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        )}

        {/* Send Request */}
        <div className="flex gap-4">
          <Button onClick={sendRequest} disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
          <Button variant="outline" onClick={() => setResponse('')}>
            Clear Response
          </Button>
        </div>

        {/* Response */}
        {response && (
          <div id="response">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Response</h2>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(response)}
              >
                Copy Response
              </Button>
            </div>
            <pre className="bg-zinc-900 text-white p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
