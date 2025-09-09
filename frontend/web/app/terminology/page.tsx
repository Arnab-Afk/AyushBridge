"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TerminologyResult {
  code: string
  displayName: string
  definition: string
  mappings: string
  mappingType: 'exact' | 'narrower' | 'broader' | 'partial' | 'none'
}

const sampleResults: TerminologyResult[] = [
  {
    code: "NAMASTE-0001",
    displayName: "Ayurvedic Concept 1",
    definition: "Description of Ayurvedic Concept 1.",
    mappings: "ICD-11: TM2-0001 (Exact Match)",
    mappingType: "exact"
  },
  {
    code: "NAMASTE-0002", 
    displayName: "Ayurvedic Concept 2",
    definition: "Description of Ayurvedic Concept 2.",
    mappings: "ICD-11: TM2-0002 (Narrower Match)",
    mappingType: "narrower"
  },
  {
    code: "NAMASTE-0003",
    displayName: "Ayurvedic Concept 3", 
    definition: "Description of Ayurvedic Concept 3.",
    mappings: "ICD-11: TM2-0003 (Broader Match)",
    mappingType: "broader"
  },
  {
    code: "NAMASTE-0004",
    displayName: "Ayurvedic Concept 4",
    definition: "Description of Ayurvedic Concept 4.", 
    mappings: "ICD-11: TM2-0004 (No Match)",
    mappingType: "none"
  },
  {
    code: "NAMASTE-0005",
    displayName: "Ayurvedic Concept 5",
    definition: "Description of Ayurvedic Concept 5.",
    mappings: "ICD-11: TM2-0005 (Partial Match)",
    mappingType: "partial"
  }
]

export default function TerminologyExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSystem, setSelectedSystem] = useState("All Systems")
  const [selectedEquivalence, setSelectedEquivalence] = useState("All Types")
  const [selectedSection, setSelectedSection] = useState("All Sections")
  const [results, setResults] = useState<TerminologyResult[]>(sampleResults)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real app, this would trigger an API call
    if (query.trim() === "") {
      setResults(sampleResults)
    } else {
      const filtered = sampleResults.filter(result => 
        result.displayName.toLowerCase().includes(query.toLowerCase()) ||
        result.code.toLowerCase().includes(query.toLowerCase()) ||
        result.definition.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    }
  }

  const getMappingBadgeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-green-100 text-green-700'
      case 'narrower': return 'bg-blue-100 text-blue-700'
      case 'broader': return 'bg-purple-100 text-purple-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'none': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
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
                <a href="/terminology" className="text-indigo-600 font-medium">Terminology Explorer</a>
                <a href="/mappings" className="text-gray-600 hover:text-gray-900 transition-colors">Mapping Tools</a>
                <a href="/documentation" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
                <a href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terminology Explorer</h1>
          <p className="text-lg text-gray-600">
            Search and browse NAMASTE codes, WHO International Terminologies for Ayurveda, and their ICD-11 mappings.
          </p>
        </div>

        {/* Search Interface */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for codes, terms, or mappings"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Filter Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Traditional Medicine System</label>
                <select 
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>All Systems</option>
                  <option>Ayurveda</option>
                  <option>Yoga</option>
                  <option>Unani</option>
                  <option>Siddha</option>
                  <option>Homeopathy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mapping Equivalence</label>
                <select 
                  value={selectedEquivalence}
                  onChange={(e) => setSelectedEquivalence(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>All Types</option>
                  <option>Exact Match</option>
                  <option>Narrower Match</option>
                  <option>Broader Match</option>
                  <option>Partial Match</option>
                  <option>No Match</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ICD-11 Section</label>
                <select 
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>All Sections</option>
                  <option>TM1 - Traditional Medicine Conditions</option>
                  <option>TM2 - Traditional Medicine Modalities</option>
                  <option>TM3 - Traditional Medicine Module</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Search Results</CardTitle>
            <p className="text-sm text-gray-600">{results.length} results found</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Code</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Display Name</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Definition</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Mappings</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {result.code}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-left">
                          {result.displayName}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {result.definition}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getMappingBadgeColor(result.mappingType)} border-0 text-xs`}>
                          {result.mappings}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing 1 to {results.length} of {results.length} results
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled className="border-gray-300 text-gray-400">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled className="border-gray-300 text-gray-400">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">4,500+</div>
              <div className="text-sm text-gray-600">NAMASTE Terms</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">3,200+</div>
              <div className="text-sm text-gray-600">Mapped Concepts</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">529</div>
              <div className="text-sm text-gray-600">ICD-11 Categories</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">97.2%</div>
              <div className="text-sm text-gray-600">Mapping Accuracy</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
