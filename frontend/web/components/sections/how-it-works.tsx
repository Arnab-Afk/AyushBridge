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
    <section className="py-32 bg-gray-50/50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100/80 backdrop-blur-sm mb-6">
            <span className="text-gray-600 text-sm font-light">⚙️ Integration Process</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-6 text-gray-900 tracking-tight">
            Simple
            <br />
            <span className="font-medium text-gray-800">4-Step Integration</span>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Deploy AyushBridge in minutes with our streamlined integration process
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:bg-white/80 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl text-gray-700">{step.icon}</div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">{step.title}</h3>
                        <p className="text-gray-600 text-sm font-light mt-1">{step.description}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                      {step.step}
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 font-light">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-light text-center mb-12 text-gray-900">Clinical Workflow</h3>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h4 className="text-xl font-medium text-gray-900 mb-2">From Traditional Terms to Standardized Codes</h4>
              <p className="text-gray-600 font-light">
                Seamless workflow for dual-coding traditional medicine conditions
              </p>
            </div>
            
            <div className="space-y-4">
              {workflow.map((flow, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-900 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50/70 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">{flow.from}</span>
                      <span className="text-gray-400 text-sm">→</span>
                      <span className="font-medium text-sm text-gray-900">{flow.to}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-light mt-2">{flow.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <h4 className="font-medium text-sm mb-2">Result: Complete Dual-Coded Medical Record</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  FHIR Condition resource with NAMASTE traditional terms + ICD-11 standardized codes + audit trails
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
