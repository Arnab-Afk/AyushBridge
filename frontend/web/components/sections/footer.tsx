"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const supportChannels = [
  {
    type: "Technical Support",
    channels: [
      { name: "Documentation", url: "docs.ayushbridge.in", icon: "📖" },
      { name: "GitHub Issues", url: "github.com/Arnab-Afk/AyushBridge", icon: "🐛" },
      { name: "Community Forum", url: "community.ayushbridge.in", icon: "💬" }
    ]
  },
  {
    type: "Commercial Support", 
    channels: [
      { name: "Enterprise Email", url: "enterprise@ayushbridge.in", icon: "📧" },
      { name: "Phone Support", url: "+91-XXX-XXX-XXXX", icon: "📞" },
      { name: "Professional Services", url: "Custom implementation", icon: "🏢" }
    ]
  },
  {
    type: "Emergency Support",
    channels: [
      { name: "24/7 Monitoring", url: "status.ayushbridge.in", icon: "🔍" },
      { name: "Incident Response", url: "incidents@ayushbridge.in", icon: "🚨" },
      { name: "SLA Guarantee", url: "99.9% uptime for enterprise", icon: "⚡" }
    ]
  }
]

const acknowledgments = [
  "Ministry of Ayush, Government of India for NAMASTE terminology standards",
  "World Health Organization for ICD-11 Traditional Medicine Module", 
  "National Health Authority for ABHA integration guidelines",
  "HL7 International for FHIR R4 specifications",
  "Healthcare technology community for feedback and contributions"
]

const contributionSteps = [
  "Fork and clone the repository",
  "Create development branch", 
  "Install dependencies and set up dev environment",
  "Add tests for new functionality",
  "Update documentation",
  "Submit pull request with detailed description"
]

export default function Footer() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        
        {/* Support & Contact */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              📞 Support & Contact
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Get <span className="text-primary">Help & Support</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple channels for technical support, commercial inquiries, and emergency assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportChannels.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.channels.map((channel, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="text-lg">{channel.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{channel.name}</div>
                        <div className="text-xs text-muted-foreground">{channel.url}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Contributing */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">
              🤝 Contributing
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Join the <span className="text-primary">Healthcare Technology</span> Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We welcome contributions from developers, healthcare professionals, and technology enthusiasts
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Development Process</CardTitle>
                  <CardDescription>
                    Step-by-step guide to contribute code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {contributionSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code Standards</CardTitle>
                  <CardDescription>
                    Quality requirements for contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">ESLint Configuration</span>
                    <Badge variant="secondary">Airbnb</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Code Formatting</span>
                    <Badge variant="secondary">Prettier</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Test Coverage</span>
                    <Badge variant="secondary">Min 80%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Documentation</span>
                    <Badge variant="secondary">JSDoc</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Commit Messages</span>
                    <Badge variant="secondary">Conventional</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="mr-4">
                View Contributing Guide
              </Button>
              <Button variant="outline" size="lg">
                Join Community Forum
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Acknowledgments */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              🙏 Acknowledgments
            </Badge>
            <h3 className="text-2xl font-semibold mb-4">Special Thanks</h3>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <ul className="space-y-3">
                {acknowledgments.map((ack, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground">{ack}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* License & Footer Info */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">📄 MIT License</Badge>
                  <p className="text-sm text-muted-foreground">
                    Open source software with commercial-friendly licensing
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <div className="font-medium mb-1">Base URLs</div>
                    <div>Production: api.ayushbridge.in</div>
                    <div>Development: localhost:3000</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Version</div>
                    <div>API Version: v1.0.0</div>
                    <div>FHIR Version: R4</div>
                  </div>
                </div>
                
                <Separator />
                
                <p className="text-xs text-muted-foreground">
                  © 2025 AyushBridge. Built with ❤️ for traditional medicine digitization.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
