"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Terminology Management",
    description: "Complete FHIR-compliant resources with 4,500+ NAMASTE terms and seamless ICD-11 integration for traditional medicine systems.",
    gradient: "from-purple-500 to-pink-500",
    image: "/api/placeholder/400/240"
  },
  {
    title: "Smart Search & Discovery", 
    description: "AI-powered auto-complete with intelligent suggestions, semantic search, and multilingual support across traditional medicine systems.",
    gradient: "from-blue-500 to-cyan-500",
    image: "/api/placeholder/400/240"
  },
  {
    title: "Bidirectional Code Translation",
    description: "Seamless mapping between NAMASTE, ICD-11 TM2, and Biomedicine codes with confidence scoring and batch processing.",
    gradient: "from-green-500 to-emerald-500",
    image: "/api/placeholder/400/240"
  },
  {
    title: "Enterprise Security",
    description: "ABHA OAuth 2.0 authentication, role-based access control, comprehensive audit trails, and GDPR compliance.",
    gradient: "from-orange-500 to-red-500",
    image: "/api/placeholder/400/240"
  },
  {
    title: "Real-time Analytics",
    description: "Deep insights into terminology usage, mapping quality metrics, performance monitoring, and clinical prescription patterns.",
    gradient: "from-violet-500 to-purple-500",
    image: "/api/placeholder/400/240"
  },
  {
    title: "Modern Tech Stack",
    description: "Built with Node.js, MongoDB, Redis caching, Elasticsearch, and Docker/Kubernetes for enterprise scalability.",
    gradient: "from-indigo-500 to-blue-500",
    image: "/api/placeholder/400/240"
  }
]

export default function Features() {
  return (
    <section className="py-32 bg-gray-50/50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100/80 backdrop-blur-sm mb-6">
            <span className="text-gray-600 text-sm font-light">✨ Platform Capabilities</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-6 text-gray-900 tracking-tight">
            Enterprise-Grade
            <br />
            <span className="font-medium text-gray-800">Terminology Platform</span>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            FHIR-compliant infrastructure connecting traditional medicine with modern healthcare standards
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:bg-white/80 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50">
                {/* Minimal Icon */}
                <div className="w-12 h-12 bg-gray-900 rounded-xl mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed mb-6">
                  {feature.description}
                </p>
                <button className="text-gray-900 text-sm font-medium hover:text-gray-600 transition-colors flex items-center gap-2 group">
                  Learn more
                  <span className="transform transition-transform group-hover:translate-x-1 text-xs">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
