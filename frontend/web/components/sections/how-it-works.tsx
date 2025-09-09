"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const steps = [
  {
    step: "01",
    title: "Setup & Authentication",
    description: "Configure OAuth 2.0 with ABHA integration for secure access",
    details: [
      "Install AyushBridge microservice",
      "Configure ABHA OAuth credentials", 
      "Set up environment variables",
      "Initialize database and import NAMASTE terms"
    ],
    icon: "🔐"
  },
  {
    step: "02", 
    title: "Integrate FHIR APIs",
    description: "Connect your EMR system with our FHIR R4-compliant endpoints",
    details: [
      "Implement auto-complete search APIs",
      "Add code translation endpoints",
      "Configure FHIR Bundle uploads",
      "Set up real-time synchronization"
    ],
    icon: "🔗"
  },
  {
    step: "03",
    title: "Enable Dual Coding",
    description: "Start creating dual-coded medical records with NAMASTE and ICD-11",
    details: [
      "Search and select NAMASTE terms",
      "Auto-translate to ICD-11 codes",
      "Create dual-coded conditions",
      "Generate insurance-ready claims"
    ],
    icon: "🔄"
  },
  {
    step: "04",
    title: "Monitor & Optimize",
    description: "Track usage analytics and optimize terminology mappings",
    details: [
      "Monitor API performance metrics",
      "Analyze code usage patterns",
      "Review translation confidence scores", 
      "Generate compliance reports"
    ],
    icon: "📊"
  }
]

const workflow = [
  { from: "Clinical Input", to: "NAMASTE Search", description: "Practitioner searches for traditional medicine terms" },
  { from: "NAMASTE Search", to: "Auto-complete", description: "AI-powered suggestions with multilingual support" },
  { from: "Auto-complete", to: "Code Translation", description: "Bidirectional mapping to ICD-11 TM2/Bio codes" },
  { from: "Code Translation", to: "Dual Coding", description: "Create FHIR Condition with multiple coding systems" },
  { from: "Dual Coding", to: "EMR Storage", description: "Store in FHIR-compliant format with audit trails" }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            ⚙️ How It Works
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Simple <span className="text-primary">4-Step Integration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get up and running with AyushBridge in minutes, not months. Our streamlined process ensures quick deployment and immediate value.
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {step.step}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{step.icon}</span>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow Diagram */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Clinical Workflow</h3>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">From Traditional Terms to Standardized Codes</CardTitle>
              <CardDescription className="text-center">
                Seamless workflow for dual-coding traditional medicine conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflow.map((flow, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{flow.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium text-sm">{flow.to}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{flow.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Result: Complete Dual-Coded Medical Record</h4>
                  <p className="text-xs text-muted-foreground">
                    FHIR Condition resource with NAMASTE traditional terms + ICD-11 standardized codes + audit trails
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
