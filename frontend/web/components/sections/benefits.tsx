"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const benefits = [
  {
    title: "Faster Implementation",
    description: "Deploy traditional medicine EMR systems 10x faster with pre-built FHIR R4 terminology resources and ready-to-use APIs.",
    metric: "90% faster deployment",
    gradient: "from-emerald-500 to-teal-500",
    icon: "⚡"
  },
  {
    title: "Improved Accuracy", 
    description: "Ensure precise medical coding with AI-powered suggestions, confidence scoring, and validated terminology mappings.",
    metric: "97.2% translation accuracy",
    gradient: "from-blue-500 to-indigo-500",
    icon: "🎯"
  },
  {
    title: "Seamless Interoperability",
    description: "Bridge traditional and modern medicine with dual-coding capabilities for insurance claims and healthcare analytics.",
    metric: "100% FHIR R4 compliant",
    gradient: "from-purple-500 to-pink-500",
    icon: "🔗"
  },
  {
    title: "Cost Effective Solution",
    description: "Reduce infrastructure costs with lightweight microservice architecture and cloud-ready deployment options.",
    metric: "60% cost reduction",
    gradient: "from-orange-500 to-red-500",
    icon: "💰"
  },
  {
    title: "Enterprise Security",
    description: "Built-in ABHA authentication, role-based access control, comprehensive audit trails, and data protection compliance.",
    metric: "ISO 22600 compliant",
    gradient: "from-slate-500 to-gray-600",
    icon: "🛡️"
  },
  {
    title: "Global Standards",
    description: "WHO ICD-11 integration ensures international compatibility and standardization for traditional medicine practices.",
    metric: "529+ TM2 categories",
    gradient: "from-cyan-500 to-blue-500",
    icon: "🌍"
  }
]

export default function Benefits() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100/80 backdrop-blur-sm mb-6">
            <span className="text-gray-600 text-sm font-light">📊 Platform Impact</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-6 text-gray-900 tracking-tight">
            Measurable
            <br />
            <span className="font-medium text-gray-800">Healthcare Outcomes</span>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real results from healthcare organizations using AyushBridge for traditional medicine integration
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="bg-gray-50/50 backdrop-blur-sm border border-gray-200/30 rounded-2xl p-8 hover:bg-gray-50/80 transition-all duration-500">
                {/* Metric Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl text-gray-700">{benefit.icon}</div>
                  <div className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                    {benefit.metric}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed mb-6">
                  {benefit.description}
                </p>
                <button className="text-gray-900 text-sm font-medium hover:text-gray-600 transition-colors flex items-center gap-2 group">
                  Explore impact
                  <span className="transform transition-transform group-hover:translate-x-1 text-xs">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-4">Ready to Transform Healthcare?</h3>
            <p className="text-gray-300 font-light mb-8 leading-relaxed">
              Join leading organizations integrating traditional medicine with modern standards
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 rounded-full bg-white text-gray-900 font-medium text-sm transition-all duration-200 hover:bg-gray-100">
                Start Integration
              </button>
              <button className="px-8 py-3 rounded-full border border-white/30 text-white font-medium text-sm transition-all duration-200 hover:bg-white/10">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
