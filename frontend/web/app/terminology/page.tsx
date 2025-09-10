"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import SofaxBackground from "@/components/sofax-background"
import Footer from "@/components/sections/footer"

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
    displayName: "Vata Dosha Imbalance",
    definition: "Constitutional imbalance characterized by excess Vata dosha causing dryness, irregular digestion, and anxiety.",
    mappings: "ICD-11: MB23.Z (Exact Match)",
    mappingType: "exact"
  },
  {
    code: "NAMASTE-0002", 
    displayName: "Pitta Dosha Disorder",
    definition: "Imbalance of Pitta dosha leading to heat-related symptoms, inflammation, and digestive fire disturbances.",
    mappings: "ICD-11: 5D91 (Narrower Match)",
    mappingType: "narrower"
  },
  {
    code: "NAMASTE-0003",
    displayName: "Kapha Dosha Excess", 
    definition: "Excessive Kapha dosha resulting in congestion, weight gain, and sluggish metabolism.",
    mappings: "ICD-11: 5D93 (Broader Match)",
    mappingType: "broader"
  },
  {
    code: "NAMASTE-0004",
    displayName: "Agni Mandya",
    definition: "Weakened digestive fire leading to poor digestion, formation of ama (toxins), and various health issues.", 
    mappings: "ICD-11: 5D95 (No Match)",
    mappingType: "none"
  },
  {
    code: "NAMASTE-0005",
    displayName: "Ojas Depletion",
    definition: "Reduction in vital essence (Ojas) causing immunity weakness, fatigue, and reduced life force.",
    mappings: "ICD-11: 5D97 (Partial Match)",
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
      case 'exact': return 'bg-green-600/20 text-green-300 border-green-600/30'
      case 'narrower': return 'bg-blue-600/20 text-blue-300 border-blue-600/30'
      case 'broader': return 'bg-purple-600/20 text-purple-300 border-purple-600/30'
      case 'partial': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30'
      case 'none': return 'bg-gray-600/20 text-gray-300 border-gray-600/30'
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30'
    }
  }

  return (
    <div>
      {/* Hero Section with Sofax Background */}
      <SofaxBackground>
        <Header />
        <div className="container mx-auto px-6 py-4 lg:py-6">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3">
              Terminology <span className="sofax-text-gradient">Explorer</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">
              Search and browse NAMASTE codes, WHO International Terminologies for Ayurveda, and their ICD-11 mappings.
            </p>
          </div>
        </div>
      </SofaxBackground>

      {/* Main Content */}
      <div className="bg-background">
        <div className="container mx-auto px-6 py-16">
          {/* Search Interface */}
          <Card className="sofax-glass mb-8">
            <CardContent className="p-8">
              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for codes, terms, or mappings"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
              </div>

              {/* Filter Options */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Traditional Medicine System</label>
                  <select 
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option className="bg-gray-900 text-white">All Systems</option>
                    <option className="bg-gray-900 text-white">Ayurveda</option>
                    <option className="bg-gray-900 text-white">Yoga</option>
                    <option className="bg-gray-900 text-white">Unani</option>
                    <option className="bg-gray-900 text-white">Siddha</option>
                    <option className="bg-gray-900 text-white">Homeopathy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mapping Equivalence</label>
                  <select 
                    value={selectedEquivalence}
                    onChange={(e) => setSelectedEquivalence(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option className="bg-gray-900 text-white">All Types</option>
                    <option className="bg-gray-900 text-white">Exact Match</option>
                    <option className="bg-gray-900 text-white">Narrower Match</option>
                    <option className="bg-gray-900 text-white">Broader Match</option>
                    <option className="bg-gray-900 text-white">Partial Match</option>
                    <option className="bg-gray-900 text-white">No Match</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">ICD-11 Section</label>
                  <select 
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option className="bg-gray-900 text-white">All Sections</option>
                    <option className="bg-gray-900 text-white">TM1 - Traditional Medicine Conditions</option>
                    <option className="bg-gray-900 text-white">TM2 - Traditional Medicine Modalities</option>
                    <option className="bg-gray-900 text-white">TM3 - Traditional Medicine Module</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <Card className="sofax-glass mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Search Results</CardTitle>
              <p className="text-sm text-white/60">{results.length} results found</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 font-medium text-white/80">Code</th>
                      <th className="text-left py-4 px-4 font-medium text-white/80">Display Name</th>
                      <th className="text-left py-4 px-4 font-medium text-white/80">Definition</th>
                      <th className="text-left py-4 px-4 font-medium text-white/80">Mappings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <code className="text-sm font-mono bg-white/10 px-2 py-1 rounded text-white/90">
                            {result.code}
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-primary hover:text-purple-300 font-medium text-left transition-colors">
                            {result.displayName}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-white/60 text-sm">
                          {result.definition}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getMappingBadgeColor(result.mappingType)} border text-xs`}>
                            {result.mappings}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/60">
                  Showing 1 to {results.length} of {results.length} results
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled className="border-white/20 text-white/40">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled className="border-white/20 text-white/40">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="sofax-glass text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">4,500+</div>
                <div className="text-sm text-white/60">NAMASTE Terms</div>
              </CardContent>
            </Card>
            
            <Card className="sofax-glass text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">3,200+</div>
                <div className="text-sm text-white/60">Mapped Concepts</div>
              </CardContent>
            </Card>
            
            <Card className="sofax-glass text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">529</div>
                <div className="text-sm text-white/60">ICD-11 Categories</div>
              </CardContent>
            </Card>
            
            <Card className="sofax-glass text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">97.2%</div>
                <div className="text-sm text-white/60">Mapping Accuracy</div>
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
