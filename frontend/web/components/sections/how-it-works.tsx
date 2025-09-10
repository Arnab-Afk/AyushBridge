"use client"

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
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
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
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
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
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
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
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
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
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F23] to-[#1A1A2E]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6">
            <span className="text-purple-400 text-sm font-medium">⚙️</span>
            <span className="text-white/90 text-sm font-medium ml-2">Integration Process</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Simple
            <br />
            <span className="sofax-text-gradient">4-Step Integration</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Deploy AyushBridge in minutes with our streamlined integration process
          </p>
        </div>

        {/* Implementation Steps */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent z-10" />
                )}
                
                <div className="sofax-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-500 h-full relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sofax-gradient rounded-xl flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <p className="text-white/70 mt-1">{step.description}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 sofax-glass text-purple-400 font-bold rounded-full border border-purple-500/20">
                      {step.step}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 relative z-10">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-white/80">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
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
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Clinical Workflow</h3>
          <div className="sofax-card rounded-2xl p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-x-8 translate-y-8" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">From Traditional Terms to Standardized Codes</h4>
                <p className="text-white/70 text-lg">
                  Seamless workflow for dual-coding traditional medicine conditions
                </p>
              </div>
              
              <div className="space-y-6">
                {workflow.map((flow, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sofax-gradient text-white font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 sofax-glass rounded-xl p-6 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white">{flow.from}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <span className="font-bold text-white">{flow.to}</span>
                        </div>
                        <p className="text-white/70">{flow.description}</p>
                      </div>
                    </div>
                    
                    {/* Connection line */}
                    {index < workflow.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-6 bg-gradient-to-b from-purple-500 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="sofax-gradient rounded-xl p-6 text-white text-center">
                  <h4 className="font-bold text-lg mb-2">Result: Complete Dual-Coded Medical Record</h4>
                  <p className="text-white/90 leading-relaxed">
                    FHIR Condition resource with NAMASTE traditional terms + ICD-11 standardized codes + audit trails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}