"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const capabilities = [
  "FHIR R4-compliant terminology resources",
  "Auto-complete search with intelligent suggestions", 
  "Bidirectional code translation (NAMASTE ↔ ICD-11 TM2/Biomedicine)",
  "Secure FHIR Bundle uploads with OAuth 2.0",
  "Real-time synchronization with WHO ICD-11 API",
  "Audit-ready metadata for compliance"
]

export default function SolutionOverview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">
            🚀 Solution Overview
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-primary">AyushBridge</span> Terminology Microservice
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
            A lightweight terminology microservice that bridges NAMASTE codes, WHO International Terminologies for Ayurveda, 
            and WHO ICD-11 classifications (both TM2 and Biomedicine) to enable comprehensive dual-coding capabilities 
            for traditional medicine EMR systems.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Core Capabilities</CardTitle>
              <CardDescription className="text-center">
                Essential features that power traditional medicine digitization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{capability}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🏗️ System Architecture</CardTitle>
              <CardDescription className="text-center">
                Microservice architecture with secure authentication and real-time synchronization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-6 rounded-lg">
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre font-mono">
{`┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   EMR Frontend  │────│  API Gateway     │────│ Terminology     │
│   (Clinical UI) │    │  (OAuth 2.0)     │    │ Microservice    │
│   - Auto-complete│    │  - Rate Limiting │    │ - FHIR Resources│
│   - Dual Coding │    │  - Authentication│    │ - Code Mapping  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                      │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ABHA Identity │────│  Authentication  │    │ FHIR Resources  │
│   Provider      │    │  Service         │    │ & Storage       │
│   - Health ID   │    │  - JWT Tokens    │    │ - CodeSystems   │
│   - OAuth 2.0   │    │  - Role-based    │    │ - ConceptMaps   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                      │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ WHO ICD-11 API  │────│ External API     │    │ Database Layer  │
│ (TM2 & Bio)     │    │ Sync Service     │    │ & Cache         │
│ - Real-time sync│    │ - Version control│    │ - MongoDB/SQL   │
│ - Updates       │    │ - Error handling │    │ - Redis Cache   │
└─────────────────┘    └──────────────────┘    └─────────────────┘`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
