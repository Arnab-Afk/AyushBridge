"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const endpoints = [
  {
    method: "GET",
    path: "/fhir/CodeSystem/namaste/$lookup",
    description: "Look up specific NAMASTE terminology codes",
    params: ["code (required)", "system (optional)", "version (optional)", "displayLanguage (optional)"]
  },
  {
    method: "GET", 
    path: "/fhir/ValueSet/namaste/$expand",
    description: "Auto-complete search for NAMASTE terms",
    params: ["filter (required)", "count (optional)", "system (optional)", "includeDefinition (optional)"]
  },
  {
    method: "POST",
    path: "/fhir/ConceptMap/namaste-to-icd11/$translate", 
    description: "Translate codes between terminology systems",
    params: ["code (required)", "system (required)", "target (required)", "reverse (optional)"]
  },
  {
    method: "POST",
    path: "/fhir/Bundle",
    description: "Upload FHIR Bundle with dual-coded conditions",
    params: ["Bundle resource with dual-coded Condition entries"]
  }
]

const codeExamples = {
  javascript: `// Initialize FHIR client
const FHIRClient = require('@smile-cdr/fhirts');

const client = new FHIRClient({
  baseUrl: 'https://api.ayushbridge.in/fhir',
  auth: { bearer: 'YOUR_ABHA_TOKEN' }
});

// Search for NAMASTE terms
async function searchTerms(query) {
  const response = await client.request({
    url: 'ValueSet/namaste/$expand',
    method: 'GET',
    params: { filter: query, count: 10 }
  });
  return response.expansion.contains;
}

// Translate NAMASTE to ICD-11
async function translateCode(namasteCode) {
  const response = await client.request({
    url: 'ConceptMap/namaste-to-icd11/$translate',
    method: 'POST',
    body: {
      resourceType: 'Parameters',
      parameter: [
        { name: 'code', valueCode: namasteCode },
        { name: 'system', valueUri: 'https://ayush.gov.in/fhir/CodeSystem/namaste' },
        { name: 'target', valueUri: 'http://id.who.int/icd/release/11/mms' }
      ]
    }
  });
  return response.parameter.find(p => p.name === 'match');
}`,

  python: `import requests

class AyushBridgeClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/fhir+json'
        }
    
    def search_terms(self, query, count=10):
        """Search for NAMASTE terms with auto-complete"""
        url = f"{self.base_url}/ValueSet/namaste/$expand"
        params = {'filter': query, 'count': count}
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data.get('expansion', {}).get('contains', [])
    
    def translate_code(self, code, source_system, target_system):
        """Translate code between systems"""
        url = f"{self.base_url}/ConceptMap/namaste-to-icd11/$translate"
        
        payload = {
            "resourceType": "Parameters",
            "parameter": [
                {"name": "code", "valueCode": code},
                {"name": "system", "valueUri": source_system},
                {"name": "target", "valueUri": target_system}
            ]
        }
        
        response = requests.post(url, headers=self.headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        matches = [p for p in data.get('parameter', []) if p.get('name') == 'match']
        return matches[0] if matches else None

# Usage
client = AyushBridgeClient('https://api.ayushbridge.in/fhir', 'YOUR_ABHA_TOKEN')
terms = client.search_terms('amavata')`,

  curl: `# Search for NAMASTE terms
curl -X GET "https://api.ayushbridge.in/fhir/ValueSet/namaste/\\$expand?filter=diabetes&count=5" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  | jq '.expansion.contains[]'

# Lookup specific NAMASTE code  
curl -X GET "https://api.ayushbridge.in/fhir/CodeSystem/namaste/\\$lookup?code=NAM001" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  | jq '.parameter[]'

# Translate NAMASTE to ICD-11 TM2
curl -X POST "https://api.ayushbridge.in/fhir/ConceptMap/namaste-to-icd11/\\$translate" \\
  -H "Content-Type: application/fhir+json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "resourceType": "Parameters",
    "parameter": [
      {"name": "code", "valueCode": "NAM001"},
      {"name": "system", "valueUri": "https://ayush.gov.in/fhir/CodeSystem/namaste"},
      {"name": "target", "valueUri": "http://id.who.int/icd/release/11/mms"}
    ]
  }' | jq '.parameter[]'`
}

const quickStart = [
  "git clone https://github.com/Arnab-Afk/AyushBridge.git",
  "cd AyushBridge",
  "npm install", 
  "cp .env.example .env",
  "npm run db:init",
  "npm run import:namaste",
  "npm run sync:icd11",
  "npm start"
]

export default function ApiDocumentation() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">
            📚 API Documentation
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Developer-Friendly <span className="text-primary">FHIR R4 APIs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive REST APIs with OAuth 2.0 authentication and extensive code examples
          </p>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Core API Endpoints</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{endpoint.path}</CardTitle>
                    <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                      {endpoint.method}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Parameters:</div>
                    <ul className="space-y-1">
                      {endpoint.params.map((param, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          • {param}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">💡 Usage Examples</h3>
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="javascript">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <Card>
                    <CardContent className="p-0">
                      <pre className="bg-muted p-6 rounded-lg text-xs overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Quick Start */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">🚀 Quick Start Guide</h3>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Installation & Setup</CardTitle>
                <CardDescription>
                  Get started with AyushBridge in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="space-y-2">
                    {quickStart.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <code className="text-sm text-muted-foreground">{step}</code>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="default">
                    View Full Documentation
                  </Button>
                  <Button variant="outline">
                    Download SDK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
