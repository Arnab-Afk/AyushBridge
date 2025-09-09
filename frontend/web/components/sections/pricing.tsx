"use client"

const pricingPlans = [
  {
    name: "Developer",
    price: "Free",
    period: "forever",
    description: "Perfect for individual developers and small projects",
    features: [
      "1,000 API calls/month",
      "Basic NAMASTE terminology",
      "Standard ICD-11 mapping",
      "Community support",
      "Basic documentation",
      "Rate limiting: 10 req/min"
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    name: "Professional", 
    price: "$99",
    period: "per month",
    description: "Ideal for growing healthcare applications",
    features: [
      "50,000 API calls/month",
      "Complete NAMASTE database",
      "Advanced ICD-11 mapping",
      "Priority email support",
      "Advanced documentation",
      "Rate limiting: 100 req/min",
      "Confidence scoring",
      "Batch processing"
    ],
    cta: "Start Professional",
    popular: true,
    gradient: "from-purple-500 to-purple-600"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large healthcare organizations and EMR systems",
    features: [
      "Unlimited API calls",
      "Custom terminology sets",
      "Dedicated FHIR endpoints",
      "24/7 phone support",
      "SLA guarantees",
      "No rate limiting",
      "Custom integrations",
      "On-premise deployment",
      "ABHA integration",
      "Audit trails & compliance"
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-emerald-500 to-emerald-600"
  }
]

const faqs = [
  {
    question: "What is FHIR R4 compliance?",
    answer: "FHIR R4 is the latest standard for healthcare data exchange. Our service provides fully compliant FHIR resources for terminology management, ensuring seamless integration with modern EMR systems."
  },
  {
    question: "How accurate is the NAMASTE to ICD-11 mapping?",
    answer: "Our AI-powered mapping system achieves 97.2% accuracy with confidence scoring. Each translation includes metadata about mapping quality and alternative suggestions."
  },
  {
    question: "Can I integrate with existing EMR systems?",
    answer: "Yes! Our REST APIs are designed for easy integration with any EMR system. We provide SDKs for popular languages and comprehensive documentation."
  },
  {
    question: "Is my data secure and compliant?",
    answer: "Absolutely. We follow ISO 27001 standards, provide GDPR compliance, audit trails, and support ABHA authentication for Indian healthcare systems."
  },
  {
    question: "What support do you offer?",
    answer: "We offer community support for free users, priority email for professional plans, and 24/7 phone support with SLA guarantees for enterprise customers."
  }
]

export default function Pricing() {
  return (
    <section className="py-24 relative" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F23] to-[#1A1A2E]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6">
            <span className="text-purple-400 text-sm font-medium">💰</span>
            <span className="text-white/90 text-sm font-medium ml-2">Flexible Pricing</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Choose Your
            <br />
            <span className="sofax-text-gradient">Perfect Plan</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            From individual developers to enterprise healthcare systems, we have a plan that scales with your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="relative group">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="sofax-gradient px-6 py-2 rounded-full text-white font-semibold text-sm">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`sofax-card p-8 rounded-2xl h-full relative overflow-hidden transition-all duration-500 ${plan.popular ? 'scale-105 border-2 border-purple-500/50' : 'hover:scale-105'}`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                
                <div className="relative z-10">
                  {/* Plan header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/70 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-white/60 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <button className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${plan.popular ? 'sofax-button-primary text-white hover:shadow-xl' : 'border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5'}`}>
                      {plan.cta}
                    </button>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-white/80">
                          <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <p className="text-xl text-white/70">
              Everything you need to know about AyushBridge terminology services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="sofax-card p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 sofax-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{faq.question}</h4>
                    <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-12">
            <div className="sofax-glass p-8 rounded-2xl border border-purple-500/20">
              <h4 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h4>
              <p className="text-white/70 mb-6">
                Our team is here to help you choose the right plan for your healthcare application
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="sofax-button-primary px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-xl">
                  Contact Sales
                </button>
                <button className="px-8 py-3 rounded-full border-2 border-white/20 text-white font-semibold transition-all duration-300 hover:border-white/40 hover:bg-white/5">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
