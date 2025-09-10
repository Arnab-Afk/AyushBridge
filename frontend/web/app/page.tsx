"use client"

import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import SofaxBackground from "@/components/sofax-background"
import Features from "@/components/sections/features"
import Benefits from "@/components/sections/benefits"
import HowItWorks from "@/components/sections/how-it-works"
import ToolsShowcase from "@/components/sections/tools-showcase"
import Testimonials from "@/components/sections/testimonials"
import Pricing from "@/components/sections/pricing"
import Footer from "@/components/sections/footer"

export default function SofaxShowcase() {
  return (
    <div>
      {/* Hero Section with Sofax Background */}
      <SofaxBackground>
        <Header />
        <HeroContent />
      </SofaxBackground>
      
      {/* Content Sections */}
      <div id="features">
        <Features />
      </div>
      <div id="tools">
        <ToolsShowcase />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
