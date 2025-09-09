"use client"

import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import ShaderBackground from "@/components/shader-background"
import Features from "@/components/sections/features"
import Benefits from "@/components/sections/benefits"
import HowItWorks from "@/components/sections/how-it-works"

export default function ShaderShowcase() {
  return (
    <div>
      {/* Hero Section with Shader Background */}
      <ShaderBackground>
        <Header />
        <HeroContent />
      </ShaderBackground>
      
      {/* Content Sections */}
      <Features />
      <Benefits />
      <HowItWorks />
    </div>
  )
}
