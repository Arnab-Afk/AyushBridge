"use client"

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6 lg:px-8">
      {/* Logo */}
      <div className="flex items-center">
        <div className="text-white font-bold text-2xl tracking-tight">
          <span className="sofax-text-gradient">AyushBridge</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <a
          href="/"
          className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="/insurance"
          className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 relative group"
        >
          Insurance
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="#features"
          className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 relative group"
        >
          Features
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="#benefits"
          className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 relative group"
        >
          Solutions
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a
          href="#how-it-works"
          className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 relative group"
        >
          Process
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
      </nav>

      {/* CTA Buttons */}
      <div className="flex items-center space-x-4">
        <button className="hidden md:block text-white/80 hover:text-white text-sm font-medium transition-all duration-300">
          Sign In
        </button>
        <button className="sofax-button-primary px-6 py-2.5 rounded-full text-white font-medium text-sm transition-all duration-300 hover:shadow-lg">
          Get Started
        </button>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
