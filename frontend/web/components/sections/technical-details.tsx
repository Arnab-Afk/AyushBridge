"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const techStack = {
  backend: [
    { name: "Runtime", tech: "Node.js 18+ / Java 17+" },
    { name: "Framework", tech: "Express.js / Spring Boot" },
    { name: "FHIR Library", tech: "HAPI FHIR / @smile-cdr/fhirts" },
    { name: "Validation", tech: "FHIR R4 validation engine" }
  ],
  database: [
    { name: "Primary DB", tech: "MongoDB / PostgreSQL" },
    { name: "Caching", tech: "Redis for performance optimization" },
    { name: "Search Engine", tech: "Elasticsearch for terminology search" },
    { name: "File Storage", tech: "MinIO / AWS S3 for NAMASTE CSV" }
  ],
  security: [
    { name: "OAuth 2.0", tech: "ABHA integration" },
    { name: "JWT", tech: "Token-based authentication" },
    { name: "Encryption", tech: "AES-256 for data at rest" },
    { name: "API Security", tech: "Rate limiting and DDoS protection" }
  ],
  devops: [
    { name: "Monitoring", tech: "Prometheus + Grafana" },
    { name: "Logging", tech: "ELK Stack (Elasticsearch, Logstash, Kibana)" },
    { name: "API Docs", tech: "OpenAPI 3.0 (Swagger UI)" },
    { name: "Containerization", tech: "Docker + Kubernetes" }
  ]
}

const kpis = [
  { metric: "API Response Time (95th percentile)", target: "< 200ms", current: "150ms", status: "good" },
  { metric: "Search Accuracy", target: "> 95%", current: "97.2%", status: "excellent" },
  { metric: "Translation Confidence", target: "> 90%", current: "92.8%", status: "good" },
  { metric: "Uptime", target: "> 99.9%", current: "99.95%", status: "excellent" },
  { metric: "Error Rate", target: "< 0.1%", current: "0.05%", status: "excellent" }
]

const roadmap = [
  {
    phase: "Phase 1: Core Foundation",
    status: "✅ Complete",
    items: [
      "FHIR R4 resource definitions",
      "Basic NAMASTE and ICD-11 integration", 
      "OAuth 2.0 authentication with ABHA",
      "Auto-complete search functionality",
      "Code translation services"
    ]
  },
  {
    phase: "Phase 2: Enhanced Features", 
    status: "🚧 In Progress",
    items: [
      "Advanced search with ML-powered suggestions",
      "Bi-directional synchronization with WHO ICD-API",
      "Multi-language support (Hindi, Tamil, Telugu)",
      "Clinical decision support rules",
      "Mobile SDK for offline access"
    ]
  },
  {
    phase: "Phase 3: Analytics & Intelligence",
    status: "📋 Planned",
    items: [
      "Real-time analytics dashboard",
      "Prescription pattern analysis", 
      "Automated mapping suggestions",
      "Quality metrics and reporting",
      "Integration with national health registries"
    ]
  },
  {
    phase: "Phase 4: Advanced Capabilities",
    status: "📋 Future",
    items: [
      "AI-powered code suggestion",
      "Natural language processing for clinical notes",
      "Integration with wearable devices", 
      "Blockchain-based audit trails",
      "Cross-border health data exchange"
    ]
  }
]

export default function TechnicalDetails() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            🛠️ Technical Excellence
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Enterprise-Grade <span className="text-primary">Technology Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with modern technologies and best practices for scalability, security, and performance
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <Tabs defaultValue="backend" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="devops">DevOps</TabsTrigger>
            </TabsList>
            
            {Object.entries(techStack).map(([key, items]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{key} Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* KPIs */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Key Performance Indicators</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-2">{kpi.metric}</div>
                  <div className="text-sm font-medium mb-1">Target: {kpi.target}</div>
                  <div className={`text-lg font-bold ${
                    kpi.status === 'excellent' ? 'text-green-600' : 
                    kpi.status === 'good' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {kpi.current}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Development Roadmap */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">🚦 Development Roadmap</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {roadmap.map((phase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {phase.phase}
                    <Badge variant="outline">{phase.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
