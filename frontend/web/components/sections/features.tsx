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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Explore Our
            <br />
            <span className="text-indigo-600">
              Latest Features
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From FHIR-compliant terminology management to AI-powered code translation, our platform helps healthcare organizations scale smarter. 
            Explore the comprehensive features we've built for traditional medicine digitization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 rounded-lg">
              {/* Minimal Header */}
              <div className="h-32 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-indigo-600 rounded"></div>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors flex items-center gap-2 group">
                  View Details
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
