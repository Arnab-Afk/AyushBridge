"use client"

import { ReactNode } from "react"

interface SofaxBackgroundProps {
  children: ReactNode
}

export default function SofaxBackground({ children }: SofaxBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]" />
      
      {/* Animated gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-purple-300 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
