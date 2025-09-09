"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const terminologies = [
  {
    name: "NAMASTE",
    fullName: "National AYUSH Morbidity & Standardized Terminologies Electronic",
    count: "4,500+",
    description: "Standardized terms for Ayurveda, Siddha, and Unani disorders",
    systems: ["Ayurveda", "Siddha", "Unani"],
    status: "Essential for traditional medicine documentation in India"
  },
  {
    name: "ICD-11 TM2",
    fullName: "WHO ICD-11 Traditional Medicine Module 2",
    count: "529 + 196",
    description: "Disorder categories and pattern codes integrated into global ICD framework",
    systems: ["Traditional Medicine", "Global Standards"],
    status: "International compatibility and standardization"
  },
  {
    name: "WHO Ayurveda",
    fullName: "WHO Standardized International Terminologies for Ayurveda",
    count: "Global",
    description: "Globally recognized Ayurvedic terminology standards",
    systems: ["Ayurveda", "International"],
    status: "Bridge between traditional knowledge and modern healthcare"
  }
]

const compliance = [
  {
    title: "India's 2016 EHR Standards",
    items: ["FHIR R4 APIs", "SNOMED CT semantics", "LOINC terminology"]
  },
  {
    title: "Security & Authentication", 
    items: ["ISO 22600 access control", "ABHA-linked OAuth 2.0", "JWT token validation"]
  },
  {
    title: "Audit & Governance",
    items: ["Robust consent trails", "Version control", "Comprehensive logging"]
  },
  {
    title: "Interoperability",
    items: ["Dual-coding support", "Insurance claims ready", "Analytics integration"]
  }
]

export default function ProblemStatement() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            🎯 Problem Statement
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Harmonizing <span className="text-primary">Traditional Medicine</span> with Digital Health
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
            India's Ayush sector is rapidly transitioning from paper-based records to interoperable digital health systems. 
            Central to this transformation are key coding systems that need harmonization.
          </p>
        </div>

        {/* Key Terminologies */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Key Terminologies</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {terminologies.map((term, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{term.name}</CardTitle>
                    <Badge variant="secondary">{term.count}</Badge>
                  </div>
                  <CardDescription className="text-xs font-medium">
                    {term.fullName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {term.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {term.systems.map((system, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {system}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {term.status}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Requirements */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Compliance Requirements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {compliance.map((comp, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{comp.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comp.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
