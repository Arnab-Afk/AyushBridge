"use client"

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    title: "Chief Medical Officer",
    company: "Ayurveda Health Systems",
    image: "/api/placeholder/60/60",
    quote: "AyushBridge has revolutionized how we handle traditional medicine coding. The FHIR R4 compliance and dual-coding capabilities have made our EMR integration seamless.",
    rating: 5
  },
  {
    name: "Rajesh Kumar",
    title: "CTO",
    company: "HealthTech Solutions",
    image: "/api/placeholder/60/60",
    quote: "The API is incredibly well-designed. Implementation took just days instead of months. Our development team was impressed with the comprehensive documentation.",
    rating: 5
  },
  {
    name: "Dr. Anita Patel",
    title: "Research Director",
    company: "Traditional Medicine Institute",
    image: "/api/placeholder/60/60",
    quote: "Finally, a solution that bridges NAMASTE terminology with international standards. The confidence scoring and validation features are game-changers.",
    rating: 5
  },
  {
    name: "Michael Chen",
    title: "Product Manager",
    company: "Global Healthcare Inc.",
    image: "/api/placeholder/60/60",
    quote: "AyushBridge enabled us to expand into traditional medicine markets with confidence. The WHO ICD-11 integration is flawless.",
    rating: 5
  }
]

const stats = [
  { value: "500+", label: "Healthcare Organizations", icon: "🏥" },
  { value: "10M+", label: "Terminology Translations", icon: "🔄" },
  { value: "99.9%", label: "System Uptime", icon: "⚡" },
  { value: "4,500+", label: "NAMASTE Terms", icon: "📚" }
]

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] to-[#0F0F23]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6">
            <span className="text-purple-400 text-sm font-medium">📊</span>
            <span className="text-white/90 text-sm font-medium ml-2">Trusted Worldwide</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Empowering
            <br />
            <span className="sofax-text-gradient">Healthcare Innovation</span>
          </h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="sofax-glass p-6 rounded-2xl border border-purple-500/20">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">What Healthcare Leaders Say</h3>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Trusted by leading healthcare organizations worldwide for traditional medicine integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="sofax-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-500 h-full relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
                  
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex space-x-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-white/90 text-lg leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-white/70 text-sm">
                          {testimonial.title} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto sofax-card rounded-3xl p-12 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-x-8 translate-y-8" />
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4">
                Ready to Join Leading Healthcare Organizations?
              </h3>
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                Start integrating traditional medicine with modern healthcare standards today. 
                Join thousands of healthcare professionals already using AyushBridge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="sofax-button-primary px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl">
                  Start Free Trial
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
