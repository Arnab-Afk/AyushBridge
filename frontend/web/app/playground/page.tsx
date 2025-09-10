"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import SofaxBackground from "@/components/sofax-background"
import Footer from "@/components/sections/footer"

export default function PlaygroundPage() {
  const endpoints = [
    "Terminology Lookup",
    "Code Translation", 
    "FHIR Bundle Upload",
    "Search NAMASTE",
    "ICD-11 Mapping",
    "Condition Create",
    "Bundle Validation"
  ]

  const [selectedEndpoint, setSelectedEndpoint] = useState("Terminology Lookup")
  const [authToken, setAuthToken] = useState("")
  const [requestParams, setRequestParams] = useState({
    url: "cmfcyyugq0007srbpohh1o7s9", // ICD-11 TM2 CodeSystem ID
    code: "TM26.0",
    version: "",
    system: "http://id.who.int/icd/release/11/mms",
    target: "https://ayush.gov.in/fhir/CodeSystem/namaste",
    patientId: "test-patient-001", // Default test patient ID
    display: "Disorders of vata dosha"
  })
  const [response, setResponse] = useState("API Response will be displayed here")
  const [isLoading, setIsLoading] = useState(false)

  const renderParameterInputs = () => {
    switch (selectedEndpoint) {
      case 'Terminology Lookup':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="CodeSystem ID (e.g., cmfcyyugq0007srbpohh1o7s9)"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Code (e.g., TM26.0)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL (optional)"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Code Translation':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="ConceptMap ID"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Source Code (e.g., SR11)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Source System URL"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Target System URL"
              value={requestParams.target}
              onChange={(e) => setRequestParams(prev => ({...prev, target: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Search NAMASTE':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search Term (e.g., vata)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL (optional)"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Condition Create':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Patient ID (e.g., patient-123)"
              value={requestParams.patientId}
              onChange={(e) => setRequestParams(prev => ({...prev, patientId: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Condition Code (e.g., TM26.0)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Display Text"
              value={requestParams.display}
              onChange={(e) => setRequestParams(prev => ({...prev, display: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="URL"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Code"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Version"
              value={requestParams.version}
              onChange={(e) => setRequestParams(prev => ({...prev, version: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )
    }
  }

  // Mock response data for demo purposes when backend is not available
  const getMockResponse = (endpoint: string) => {
    switch(endpoint) {
      case 'Terminology Lookup':
        return {
          "resourceType": "Parameters",
          "parameter": [
            {
              "name": "result",
              "valueBoolean": true
            },
            {
              "name": "name",
              "valueString": "ICD-11 TM2 Module"
            },
            {
              "name": "version",
              "valueString": "2023"
            },
            {
              "name": "display",
              "valueString": "Disorders of vata dosha"
            },
            {
              "name": "code",
              "valueCode": "TM26.0"
            },
            {
              "name": "system",
              "valueUri": "http://id.who.int/icd/release/11/mms"
            },
            {
              "name": "definition",
              "valueString": "Conditions characterized by aggravated vata dosha"
            },
            {
              "name": "designation",
              "part": [
                {
                  "name": "language",
                  "valueCode": "hi"
                },
                {
                  "name": "value",
                  "valueString": "वात दोष के विकार"
                }
              ]
            }
          ]
        };

      case 'Code Translation':
        return {
          "resourceType": "Parameters",
          "parameter": [
            {
              "name": "result",
              "valueBoolean": true
            },
            {
              "name": "match",
              "part": [
                {
                  "name": "equivalence",
                  "valueCode": "equivalent"
                },
                {
                  "name": "concept",
                  "valueCoding": {
                    "system": "http://id.who.int/icd/release/11/mms",
                    "code": "TM26.0",
                    "display": "Disorders of vata dosha"
                  }
                },
                {
                  "name": "confidence",
                  "valueDecimal": 0.95
                }
              ]
            }
          ]
        };

      case 'Search NAMASTE':
        return {
          "resourceType": "Parameters",
          "parameter": [
            {
              "name": "result",
              "valueBoolean": true
            },
            {
              "name": "matches",
              "valueInteger": 3
            },
            {
              "name": "match",
              "part": [
                {
                  "name": "index",
                  "valueInteger": 0
                },
                {
                  "name": "code",
                  "valueCoding": {
                    "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",
                    "code": "SR11",
                    "display": "Vata Dosha",
                    "version": "1.0.0"
                  }
                },
                {
                  "name": "designation",
                  "valueString": "hi: वात दोष; sa: वातदोष"
                }
              ]
            },
            {
              "name": "match",
              "part": [
                {
                  "name": "index",
                  "valueInteger": 1
                },
                {
                  "name": "code",
                  "valueCoding": {
                    "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",
                    "code": "SR12",
                    "display": "Vata-Pitta Dosha",
                    "version": "1.0.0"
                  }
                },
                {
                  "name": "designation",
                  "valueString": "hi: वात-पित्त दोष"
                }
              ]
            }
          ]
        };

      case 'ICD-11 Mapping':
        return {
          "resourceType": "Bundle",
          "type": "searchset",
          "total": 2,
          "entry": [
            {
              "resource": {
                "resourceType": "ConceptMap",
                "id": "cmfczxkcw0000pau5h8g5h76g",
                "url": "https://ayushbridge.in/fhir/ConceptMap/namaste-to-icd11-tm2",
                "version": "1.0.0",
                "name": "NAMASTE_To_ICD11_TM2_Map",
                "title": "NAMASTE to ICD-11 TM2 Mapping",
                "status": "active",
                "experimental": false,
                "date": "2023-09-01T00:00:00Z",
                "publisher": "AyushBridge",
                "description": "Mapping between NAMASTE codes and ICD-11 TM2 module",
                "sourceUri": "https://ayush.gov.in/fhir/CodeSystem/namaste",
                "targetUri": "http://id.who.int/icd/release/11/mms",
                "group": [
                  {
                    "source": "https://ayush.gov.in/fhir/CodeSystem/namaste",
                    "target": "http://id.who.int/icd/release/11/mms",
                    "element": [
                      {
                        "code": "SR11",
                        "display": "Vata Dosha",
                        "target": [
                          {
                            "code": "TM26.0",
                            "display": "Disorders of vata dosha",
                            "equivalence": "equivalent",
                            "comment": "Direct mapping validated by domain experts"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        };

      case 'Condition Create':
        return {
          "resourceType": "Condition",
          "id": "example-condition-001",
          "meta": {
            "versionId": "1",
            "lastUpdated": new Date().toISOString()
          },
          "subject": {
            "reference": `Patient/${requestParams.patientId}`
          },
          "code": {
            "coding": [{
              "system": requestParams.system || "http://id.who.int/icd/release/11/mms",
              "code": requestParams.code || "TM26.0",
              "display": requestParams.display || "Disorders of vata dosha"
            }]
          },
          "clinicalStatus": {
            "coding": [{
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active"
            }]
          },
          "verificationStatus": {
            "coding": [{
              "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              "code": "confirmed"
            }]
          },
          "recordedDate": new Date().toISOString()
        };

      case 'FHIR Bundle Upload':
      case 'Bundle Validation':
        return {
          "resourceType": "Bundle",
          "id": "example-bundle-001",
          "meta": {
            "versionId": "1",
            "lastUpdated": new Date().toISOString()
          },
          "type": "transaction-response",
          "entry": [
            {
              "response": {
                "status": "201 Created",
                "location": "Patient/test-patient-002",
                "etag": "1"
              }
            },
            {
              "response": {
                "status": "201 Created",
                "location": "Condition/test-condition-001",
                "etag": "1"
              }
            }
          ]
        };

      default:
        return {
          "resourceType": "OperationOutcome",
          "issue": [
            {
              "severity": "error",
              "code": "not-supported",
              "details": {
                "text": `Endpoint ${endpoint} not supported in mock mode`
              }
            }
          ]
        };
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true)
    try {
      let response;
      const baseUrl = 'http://localhost:3000/fhir'
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      // Set flag to use mock data if needed for demo purposes
      const useMockData = true; // Set to false to use actual API

      // If using mock data for demos or when backend is unavailable
      if (useMockData) {
        // Use mock data for demonstrations
        const mockResponse = getMockResponse(selectedEndpoint);
        setResponse(JSON.stringify(mockResponse, null, 2));
        setIsLoading(false);
        return;
      }
      
      // Use actual API if not using mock data
      switch (selectedEndpoint) {
        case 'Terminology Lookup':
          // CodeSystem $lookup operation
          // Use the actual CodeSystem ID for ICD-11 TM2: cmfcyyugq0007srbpohh1o7s9
          const codeSystemId = requestParams.url || 'cmfcyyugq0007srbpohh1o7s9'
          response = await fetch(`${baseUrl}/CodeSystem/${codeSystemId}/$lookup`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              resourceType: "Parameters",
              parameter: [
                { name: 'code', valueCode: requestParams.code || 'TM26.0' },
                { name: 'system', valueUri: requestParams.system || 'http://id.who.int/icd/release/11/mms' }
              ]
            })
          })
          break

        case 'Code Translation':
          // ConceptMap $translate operation
          // Use the actual ConceptMap ID: cmfczxkcw0000pau5h8g5h76g
          const conceptMapId = requestParams.url || 'cmfczxkcw0000pau5h8g5h76g'
          response = await fetch(`${baseUrl}/ConceptMap/${conceptMapId}/$translate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              resourceType: "Parameters",
              parameter: [
                { name: 'code', valueCode: requestParams.code || 'SR11' },
                { name: 'system', valueUri: requestParams.system || 'https://ayush.gov.in/fhir/CodeSystem/namaste' },
                { name: 'target', valueUri: requestParams.target || 'http://id.who.int/icd/release/11/mms' }
              ]
            })
          })
          break

        case 'Search NAMASTE':
          // Search CodeSystem by name - use proper params for NAMASTE: cmfcyytj10000srbp2as56xqh
          const searchTerm = requestParams.code || 'vata'
          response = await fetch(`${baseUrl}/CodeSystem/$autocomplete?system=https://ayush.gov.in/fhir/CodeSystem/namaste&search=${searchTerm}`, {
            method: 'GET',
            headers
          })
          break

        case 'ICD-11 Mapping':
          // ConceptMap search for specific mappings
          response = await fetch(`${baseUrl}/ConceptMap?source=${requestParams.system || 'https://ayush.gov.in/fhir/CodeSystem/namaste'}&target=${requestParams.target || 'http://id.who.int/icd/release/11/mms'}`, {
            method: 'GET',
            headers
          })
          break

        case 'Condition Create':
          // Create Condition resource with proper FHIR structure
          if (!requestParams.patientId) {
            // Use default test patient if not specified
            requestParams.patientId = 'test-patient-001'
          }
          
          response = await fetch(`${baseUrl}/Condition`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              resourceType: 'Condition',
              subject: {
                reference: `Patient/${requestParams.patientId}`
              },
              code: {
                coding: [{
                  system: requestParams.system || 'http://id.who.int/icd/release/11/mms',
                  code: requestParams.code || 'TM26.0',
                  display: requestParams.display || 'Disorders of vata dosha'
                }]
              },
              clinicalStatus: {
                coding: [{
                  system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                  code: 'active'
                }]
              },
              verificationStatus: {
                coding: [{
                  system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
                  code: 'confirmed'
                }]
              },
              category: [
                {
                  coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/condition-category',
                    code: 'problem-list-item'
                  }]
                }
              ],
              recordedDate: new Date().toISOString()
            })
          })
          break

        case 'FHIR Bundle Upload':
          // Create Bundle with dummy data
          response = await fetch(`${baseUrl}/Bundle`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              resourceType: 'Bundle',
              type: 'transaction',
              entry: [
                {
                  resource: {
                    resourceType: 'Patient',
                    active: true,
                    name: [
                      {
                        use: 'official',
                        family: 'Sharma',
                        given: ['Raj']
                      }
                    ],
                    gender: 'male',
                    birthDate: '1985-08-12'
                  },
                  request: {
                    method: 'POST',
                    url: 'Patient'
                  }
                },
                {
                  resource: {
                    resourceType: 'Condition',
                    subject: {
                      reference: 'Patient/test-patient-001'
                    },
                    code: {
                      coding: [
                        {
                          system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
                          code: 'SR11',
                          display: 'Vata Dosha'
                        },
                        {
                          system: 'http://id.who.int/icd/release/11/mms',
                          code: 'TM26.0',
                          display: 'Disorders of vata dosha'
                        }
                      ]
                    },
                    clinicalStatus: {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                          code: 'active'
                        }
                      ]
                    }
                  },
                  request: {
                    method: 'POST',
                    url: 'Condition'
                  }
                }
              ]
            })
          })
          break

        case 'Bundle Validation':
          // Validate a bundle with actual data
          response = await fetch(`${baseUrl}/Bundle/$validate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              resourceType: 'Bundle',
              type: 'transaction',
              entry: [
                {
                  resource: {
                    resourceType: 'Condition',
                    subject: {
                      reference: 'Patient/test-patient-001'
                    },
                    code: {
                      coding: [
                        {
                          system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
                          code: 'SR11',
                          display: 'Vata Dosha'
                        }
                      ]
                    },
                    clinicalStatus: {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                          code: 'active'
                        }
                      ]
                    }
                  },
                  request: {
                    method: 'POST',
                    url: 'Condition'
                  }
                }
              ]
            })
          })
          break

        default:
          throw new Error(`Unsupported endpoint: ${selectedEndpoint}`)
      }

      let data;
      const responseText = await response.text();
      
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        // If parsing fails, use the raw text
        data = responseText;
      }

      if (!response.ok) {
        if (typeof data === 'object' && data.issue && data.issue[0]) {
          throw new Error(`API Error: ${response.status} - ${data.issue[0].details?.text || 'Unknown error'}`)
        } else {
          throw new Error(`API Error: ${response.status} - ${typeof data === 'string' ? data : 'Unknown error'}`)
        }
      }

      setResponse(typeof data === 'object' ? JSON.stringify(data, null, 2) : data)
    } catch (error) {
      console.error('API call failed:', error)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setRequestParams({
      url: "",
      code: "",
      version: "",
      system: "",
      target: "",
      patientId: "",
      display: ""
    })
    setAuthToken("")
    setResponse("API Response will be displayed here")
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <div>
      {/* Hero Section with Sofax Background */}
      <SofaxBackground>
        <Header />
        <div className="container mx-auto px-6 py-4 lg:py-6">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3">
              API <span className="sofax-text-gradient">Playground</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">
              Explore and test AyushBridge API endpoints interactively, bridging traditional Indian medicine with modern healthcare.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mt-4 max-w-3xl mx-auto">
              <p className="text-sm text-white/80">
                <strong>Demo Mode:</strong> This playground currently uses demo data to showcase API functionality. In a production environment, these API calls would connect to the actual backend services.
              </p>
            </div>
          </div>
        </div>
      </SofaxBackground>

      {/* Main Content */}
      <div className="bg-background">
        <div className="container mx-auto px-6 py-16">
          {/* API Testing Interface */}
          <Card className="sofax-glass mb-12">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Side - Request Configuration */}
                <div className="space-y-6">
                  {/* Endpoint Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Endpoint</label>
                    <select 
                      value={selectedEndpoint}
                      onChange={(e) => setSelectedEndpoint(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {endpoints.map((endpoint) => (
                        <option key={endpoint} value={endpoint} className="bg-gray-900 text-white">{endpoint}</option>
                      ))}
                    </select>
                  </div>

                  {/* Authentication */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Authentication</label>
                    <input
                      type="text"
                      placeholder="ABHA Token (Optional)"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Request Parameters */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-white">Request Parameters</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAll}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    {renderParameterInputs()}
                  </div>
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="CodeSystem ID (e.g., cmfcyyugq0007srbpohh1o7s9)"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Code (e.g., TM26.0)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL (optional)"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Code Translation':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="ConceptMap ID"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Source Code (e.g., SR11)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Source System URL"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Target System URL"
              value={requestParams.target}
              onChange={(e) => setRequestParams(prev => ({...prev, target: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Search NAMASTE':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search Term (e.g., vata)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL (optional)"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'Condition Create':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Patient ID (e.g., patient-123)"
              value={requestParams.patientId}
              onChange={(e) => setRequestParams(prev => ({...prev, patientId: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Condition Code (e.g., TM26.0)"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="System URL"
              value={requestParams.system}
              onChange={(e) => setRequestParams(prev => ({...prev, system: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Display Text"
              value={requestParams.display}
              onChange={(e) => setRequestParams(prev => ({...prev, display: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="URL"
              value={requestParams.url}
              onChange={(e) => setRequestParams(prev => ({...prev, url: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Code"
              value={requestParams.code}
              onChange={(e) => setRequestParams(prev => ({...prev, code: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Version"
              value={requestParams.version}
              onChange={(e) => setRequestParams(prev => ({...prev, version: e.target.value}))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

                  {/* Send Request Button */}
                  <Button 
                    onClick={handleSendRequest}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3"
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
                    <label className="text-sm font-medium text-white">Response</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyResponse}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </Button>
                  </div>
                  
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4 h-96 overflow-auto">
                    {response.startsWith('Error:') ? (
                      <div className="rounded-md bg-red-900/40 p-3 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-300">
                              API Error
                            </h3>
                            <pre className="text-sm text-red-200 whitespace-pre-wrap font-mono mt-1">
                              {response}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
                        {response}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="sofax-glass hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm mb-4">
                  Complete API reference with endpoints, parameters, and examples.
                </p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="sofax-glass hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm mb-4">
                  Implementation examples in multiple programming languages.
                </p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Browse Examples
                </Button>
              </CardContent>
            </Card>

            <Card className="sofax-glass hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm mb-4">
                  Get help with integration and troubleshooting issues.
                </p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
