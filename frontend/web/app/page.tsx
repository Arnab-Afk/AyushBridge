'use client';

import { useState } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div className="w-8 h-8 bg-gray-900 rounded mr-3"></div> */}
              <span className="text-xl font-semibold text-gray-900">AyushBridge</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-gray-900 transition-colors">Benefits</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#partnerships" className="text-gray-700 hover:text-gray-900 transition-colors">Partnerships</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Request a Demo
              </button>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">View Documentation</a> */}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <a href="#features" className="block py-2 text-gray-700 hover:text-gray-900">Features</a>
              <a href="#benefits" className="block py-2 text-gray-700 hover:text-gray-900">Benefits</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-gray-900">How it Works</a>
              <a href="#partnerships" className="block py-2 text-gray-700 hover:text-gray-900">Partnerships</a>
              <button className="w-full text-left py-2 bg-blue-600 text-white px-4 rounded-lg">Request a Demo</button>
              <a href="#" className="block py-2 text-gray-700 hover:text-gray-900">View Documentation</a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 py-20 px-4">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                             radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                             radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px, 150px 150px, 200px 200px'
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            AyushBridge: <span className="text-cyan-300">Seamless Integration of NAMASTE & ICD-11 TM2</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            A FHIR R4 Compliant Terminology Microservice for Harmonizing Healthcare Data
          </p>
          {/* <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Request a Demo
          </button> */}
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">Key Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Empowering Healthcare with Advanced Terminology Integration
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AyushBridge offers a suite of features designed to streamline healthcare data management and interoperability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FHIR R4 Compliance */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">FHIR R4 Compliance</h4>
              <p className="text-gray-600">
                Adheres to the latest FHIR R4 standards, ensuring seamless integration with modern healthcare systems.
              </p>
            </div>

            {/* Intelligent Auto-Complete */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Auto-Complete</h4>
              <p className="text-gray-600">
                Provides intelligent auto-complete suggestions for efficient and accurate terminology selection.
              </p>
            </div>

            {/* Cross-Terminology Translation */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Cross-Terminology Translation</h4>
              <p className="text-gray-600">
                Enables translation between NAMASTE and ICD-11 TM2, facilitating data exchange and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">Benefits</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare Data Management
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the transformative benefits of AyushBridge, designed to enhance efficiency, accuracy, and collaboration in healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Data Integrity */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Enhanced Data Integrity</h4>
              <p className="text-gray-600">
                Maintain data integrity and accuracy with FHIR R4 compliance and intelligent data validation features.
              </p>
            </div>

            {/* Improved Interoperability */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Improved Interoperability</h4>
              <p className="text-gray-600">
                Facilitates seamless data exchange between systems with cross-terminology translation capabilities.
              </p>
            </div>

            {/* Streamlined Workflows */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Streamlined Workflows</h4>
              <p className="text-gray-600">
                Optimize workflows and reduce manual effort with automated terminology integration and translation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">How it Works</h2>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <p className="text-lg text-gray-700 leading-relaxed">
              AyushBridge acts as a bridge between systems using NAMASTE and ICD-11 TM2 terminologies. It leverages FHIR R4 
              standards to provide a unified interface for accessing and managing healthcare data. The microservice offers auto-complete 
              functionality for efficient terminology selection and enables translation between the two terminologies, ensuring seamless 
              data exchange and interoperability.
            </p>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section id="partnerships" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">Partnerships</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Healthcare Partnership */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 rounded-xl text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H9l.01-2H12V9h2v2h3l-.01 2H14v4z"/>
                </svg>
              </div>
              <h4 className="font-semibold">HEALTHCARE</h4>
            </div>

            {/* Health Tech Partnership */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-xl text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4 className="font-semibold">HEALTH TECH</h4>
            </div>

            {/* Government Partnership */}
            <div className="bg-gradient-to-br from-gray-300 to-gray-500 p-8 rounded-xl text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-600">GOVERNMENT</h4>
            </div>

            {/* Research Partnership */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-xl text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 19c-3.87 0-7-3.13-7-7 0-.84.16-1.65.43-2.4l2.08 1.2L12 13.5l4.49-2.7 2.08-1.2c.27.75.43 1.56.43 2.4 0 3.87-3.13 7-7 7z"/>
                </svg>
              </div>
              <h4 className="font-semibold">RESEARCH INSTITUTIONS</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Power of AyushBridge?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Request a demo today and discover how AyushBridge can revolutionize your healthcare data management.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Request a Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
            </div>
            <div className="text-gray-600">
              © 2023 AyushBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
