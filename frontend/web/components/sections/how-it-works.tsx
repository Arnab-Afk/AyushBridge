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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-gray-200 text-gray-600">
            ⚙️ How It Works
          </Badge>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Simple <span className="text-indigo-600">4-Step Integration</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get up and running with AyushBridge in minutes, not months. Our streamlined process ensures quick deployment and immediate value.
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="group border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 rounded-lg">
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="text-sm px-3 py-1 bg-indigo-600 text-white">
                    {step.step}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{step.icon}</span>
                    <CardTitle className="text-lg text-gray-900">{step.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3 flex-shrink-0"></span>
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
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">Clinical Workflow</h3>
          <Card className="max-w-4xl mx-auto border border-gray-200 bg-white rounded-lg">
            <CardHeader>
              <CardTitle className="text-center text-gray-900">From Traditional Terms to Standardized Codes</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Seamless workflow for dual-coding traditional medicine conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflow.map((flow, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                        {index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-900">{flow.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-sm text-gray-900">{flow.to}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{flow.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-900">Result: Complete Dual-Coded Medical Record</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
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
