"use client"

const benefits = [
  {
    title: "Faster Implementation",
    description: "Deploy traditional medicine EMR systems 10x faster with pre-built FHIR R4 terminology resources and ready-to-use APIs.",
    metric: "90% faster deployment",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Improved Accuracy", 
    description: "Ensure precise medical coding with AI-powered suggestions, confidence scoring, and validated terminology mappings.",
    metric: "97.2% translation accuracy",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Seamless Interoperability",
    description: "Bridge traditional and modern medicine with dual-coding capabilities for insurance claims and healthcare analytics.",
    metric: "100% FHIR R4 compliant",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    title: "Cost Effective Solution",
    description: "Reduce infrastructure costs with lightweight microservice architecture and cloud-ready deployment options.",
    metric: "60% cost reduction",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    title: "Enterprise Security",
    description: "Built-in ABHA authentication, role-based access control, comprehensive audit trails, and data protection compliance.",
    metric: "ISO 22600 compliant",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: "Global Standards",
    description: "WHO ICD-11 integration ensures international compatibility and standardization for traditional medicine practices.",
    metric: "529+ TM2 categories",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

export default function Benefits() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] to-[#0F0F23]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6">
            <span className="text-purple-400 text-sm font-medium">📊</span>
            <span className="text-white/90 text-sm font-medium ml-2">Platform Impact</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Measurable
            <br />
            <span className="sofax-text-gradient">Healthcare Outcomes</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Real results from healthcare organizations using AyushBridge for traditional medicine integration
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="sofax-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-500 h-full relative overflow-hidden">
                {/* Background gradient effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                
                {/* Metric Badge */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 sofax-gradient rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div className="px-3 py-1 sofax-glass text-purple-400 text-xs font-semibold rounded-full border border-purple-500/20">
                    {benefit.metric}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-white relative z-10">
                  {benefit.title}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6 relative z-10">
                  {benefit.description}
                </p>
                <button className="text-purple-400 font-semibold hover:text-purple-300 transition-colors flex items-center gap-2 group relative z-10">
                  Explore impact
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto sofax-card rounded-3xl p-12 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-x-8 translate-y-8" />
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4">Ready to Transform Healthcare?</h3>
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                Join leading organizations integrating traditional medicine with modern standards
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="sofax-button-primary px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl">
                  Start Integration
                </button>
                <button className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold text-lg transition-all duration-300 hover:border-white/40 hover:bg-white/5">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
