"use client"

import Link from "next/link"
import Image from "next/image"

export default function ToolsShowcase() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] to-[#0F0F23]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full sofax-glass mb-6">
            <span className="text-purple-400 text-sm font-medium">🔧</span>
            <span className="text-white/90 text-sm font-medium ml-2">Interactive Tools</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Explore Our <span className="sofax-text-gradient">Interactive Tools</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Experience the power of AyushBridge with our interactive tools for terminology exploration and API testing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          {/* Terminology Explorer Card */}
          <div className="sofax-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-500">
            <div className="h-64 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 mb-6 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[url('/images/terminology-explorer-preview.png')] bg-cover bg-center opacity-80 hover:opacity-100 transition-opacity">
                {/* This is a placeholder - replace with actual screenshot image */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-white">Terminology Explorer</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">
              Terminology Explorer
            </h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Search, explore, and translate medical terminology across traditional medicine systems. Look up terminology codes, view detailed information, and translate between different coding systems.
            </p>
            <div className="mt-6">
              <Link href="/terminology-explorer" className="sofax-button-primary px-6 py-3 rounded-full text-white font-semibold text-base transition-all duration-300 hover:shadow-xl inline-block">
                Open Terminology Explorer
              </Link>
            </div>
          </div>
          
          {/* API Playground Card */}
          <div className="sofax-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-500">
            <div className="h-64 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 mb-6 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[url('/images/api-playground-preview.png')] bg-cover bg-center opacity-80 hover:opacity-100 transition-opacity">
                {/* This is a placeholder - replace with actual screenshot image */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-white">API Playground</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">
              API Playground
            </h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Interactive API testing environment for developers to explore and test AyushBridge's FHIR-compliant endpoints. Try different requests, view responses, and understand our API capabilities.
            </p>
            <div className="mt-6">
              <Link href="/playground" className="sofax-button-primary px-6 py-3 rounded-full text-white font-semibold text-base transition-all duration-300 hover:shadow-xl inline-block">
                Open API Playground
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
