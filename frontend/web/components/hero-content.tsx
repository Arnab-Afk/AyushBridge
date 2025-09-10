"use client"

export default function HeroContent() {
  return (
    <main className="relative z-20 flex items-center min-h-screen px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-left">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6 relative">
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <span className="text-purple-400 text-sm font-medium relative z-10 mr-2">🏥</span>
            <span className="text-white/90 text-sm font-medium relative z-10">FHIR R4-Compliant Terminology Service</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl leading-tight font-bold text-white mb-6">
            <span className="block">Bridge</span>
            <span className="block sofax-text-gradient">Traditional</span>
            <span className="block">Medicine</span>
          </h1>

          {/* Subheading */}
          <h2 className="text-xl lg:text-2xl font-light text-white/80 mb-6">
            <span className="italic instrument">AyushBridge</span> Terminology Microservice
          </h2>

          {/* Description */}
          <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
            Bridge NAMASTE codes, WHO International Terminologies for Ayurveda, and WHO ICD-11 classifications 
            to enable comprehensive dual-coding capabilities for traditional medicine EMR systems.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a href="/terminology-explorer" className="sofax-button-primary px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl">
              Try Terminology Explorer
            </a>
            <a href="/playground" className="px-8 py-4 rounded-full bg-transparent border-2 border-white/20 text-white font-semibold text-lg transition-all duration-300 hover:border-white/40 hover:bg-white/5">
              API Playground
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-white/60">Code Mappings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">FHIR R4</div>
              <div className="text-sm text-white/60">Compliant</div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="relative">
          {/* Floating Cards */}
          <div className="relative z-10">
            <div className="sofax-glass p-6 rounded-2xl mb-6 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sofax-gradient rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">NAMASTE Integration</div>
                  <div className="text-white/60 text-sm">Traditional medicine codes</div>
                </div>
              </div>
            </div>

            <div className="sofax-glass p-6 rounded-2xl ml-8 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sofax-gradient rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Real-time API</div>
                  <div className="text-white/60 text-sm">Instant code mapping</div>
                </div>
              </div>
            </div>

            <div className="sofax-glass p-6 rounded-2xl mt-6 animate-float" style={{ animationDelay: '4s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sofax-gradient rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">FHIR R4 Compliant</div>
                  <div className="text-white/60 text-sm">Enterprise ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorations */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </main>
  )
}
