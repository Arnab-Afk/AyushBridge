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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Explore Our
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Latest Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From FHIR-compliant terminology management to AI-powered code translation, our platform helps healthcare organizations scale smarter. 
            Explore the comprehensive features we've built for traditional medicine digitization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image/Gradient Header */}
              <div className={`h-48 bg-gradient-to-br ${feature.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    Feature
                  </Badge>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group">
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
