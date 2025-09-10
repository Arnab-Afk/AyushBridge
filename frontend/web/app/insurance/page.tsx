"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Brain, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Zap,
  Search,
  Database,
  AlertCircle,
  ArrowRight
} from "lucide-react"

export default function InsurancePage() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Claims Processing",
      description: "Advanced machine learning algorithms automatically process and categorize insurance claims using ICD and NAMC code mapping."
    },
    {
      icon: Search,
      title: "Intelligent Code Matching",
      description: "TF-IDF vectorization and cosine similarity ensure accurate matching of symptoms to medical codes with 95%+ accuracy."
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Process thousands of claims in seconds, reducing manual review time from hours to minutes."
    },
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "Integration with ICD-10 and NAMC databases for complete medical terminology coverage."
    }
  ]

  const stats = [
    { label: "Claims Processed", value: "2.3M+", icon: FileText },
    { label: "Accuracy Rate", value: "97.8%", icon: CheckCircle },
    { label: "Processing Speed", value: "3.2s", icon: Zap },
    { label: "Cost Reduction", value: "68%", icon: TrendingUp }
  ]

  const processSteps = [
    {
      step: "1",
      title: "Symptom Analysis",
      description: "AI extracts and cleans symptom data from patient records",
      detail: "Natural language processing removes noise and identifies key medical terms"
    },
    {
      step: "2", 
      title: "Code Matching",
      description: "TF-IDF vectorization matches symptoms to ICD/NAMC codes",
      detail: "Cosine similarity algorithm finds the most relevant medical codes"
    },
    {
      step: "3",
      title: "Validation",
      description: "Multi-threshold validation ensures accuracy",
      detail: "Similarity scores above 0.35 threshold guarantee quality matches"
    },
    {
      step: "4",
      title: "Output Generation",
      description: "Structured claims data in Excel and JSON formats",
      detail: "Ready for immediate integration with existing insurance systems"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Shield className="mr-1 h-3 w-3" />
              AI-Powered Insurance Technology
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Revolutionary Insurance
              <span className="text-blue-600"> Claims Processing</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Transform your insurance operations with our AI-driven claims processing system. 
              Automated ICD and NAMC code mapping with machine learning accuracy.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Processing Claims
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Advanced AI Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powered by cutting-edge machine learning and natural language processing
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our AI-powered pipeline processes claims with scientific precision
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-5 left-10 w-full h-0.5 bg-blue-200" />
                  )}
                </div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{step.detail}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700">
                Technical Excellence
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                Built on Scientific Foundation
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">TF-IDF Vectorization</h3>
                    <p className="text-gray-600">Advanced text analysis using Term Frequency-Inverse Document Frequency for precise symptom matching</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cosine Similarity</h3>
                    <p className="text-gray-600">Mathematical precision in matching symptoms to medical codes with similarity thresholds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Format Output</h3>
                    <p className="text-gray-600">Exports to Excel and JSON with structured data for seamless integration</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-blue-600" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">Data Sources</div>
                  <div className="text-sm text-gray-600">ICD-10 Codes • NAMC Database • Clinical Terminology</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">Processing Engine</div>
                  <div className="text-sm text-gray-600">Python • Scikit-learn • Pandas • NumPy</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">Output Formats</div>
                  <div className="text-sm text-gray-600">Excel Reports • JSON API • Real-time Dashboard</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-blue-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Insurance Operations?
          </h2>
          <p className="mt-6 text-xl leading-8 text-blue-100">
            Join leading insurance companies using our AI-powered claims processing system
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AyushBridge Insurance AI</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AyushBridge. Powered by advanced machine learning.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
