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
    icon: "�"
  },
  {
    title: "Cost Effective Solution",
    description: "Reduce infrastructure costs with lightweight microservice architecture and cloud-ready deployment options.",
    metric: "60% cost reduction",
    gradient: "from-orange-500 to-red-500",
    icon: "�"
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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Why Choose
            <br />
            <span className="text-indigo-600">
              AyushBridge
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your traditional medicine practice with enterprise-grade terminology management. 
            Discover the measurable benefits that leading healthcare organizations experience with our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 rounded-lg">
              {/* Minimal Header with Icon */}
              <div className="h-32 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                <div className="text-3xl text-gray-600">
                  {benefit.icon}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                    {benefit.metric}
                  </Badge>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {benefit.description}
                </p>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors flex items-center gap-2 group">
                  Learn More
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border border-gray-200 bg-white rounded-lg">
            <div className="bg-indigo-600 p-8 text-white rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Healthcare System?</h3>
              <p className="text-indigo-100 mb-6 leading-relaxed">
                Join leading healthcare organizations using AyushBridge for seamless traditional medicine integration
              </p>
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium text-sm transition-all duration-200 hover:bg-gray-100">
                  Start Free Trial
                </button>
                <button className="px-8 py-3 rounded-lg border-2 border-white text-white font-medium text-sm transition-all duration-200 hover:bg-white hover:text-indigo-600">
                  Schedule Demo
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
