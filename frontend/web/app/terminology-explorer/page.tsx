"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import SofaxBackground from "@/components/sofax-background"
import Footer from "@/components/sections/footer"

// Types for terminology data
type Designation = {
  language: string;
  value: string;
  use?: string;
}

type Mapping = {
  targetSystem: string;
  targetCode: string;
  targetDisplay: string;
  equivalence: string;
  comment?: string;
}

type ConceptResult = {
  system: string;
  systemName: string;
  code: string;
  display: string;
  definition?: string;
  score: number;
  terminology: string;
  designations?: Designation[];
  mappings?: Mapping[];
}

export default function TerminologyExplorer() {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedSystems, setSelectedSystems] = useState<string[]>(["namaste", "icd11-tm2"]);
  const [searchResults, setSearchResults] = useState<ConceptResult[]>([]);
  
  // Detail view state
  const [selectedConcept, setSelectedConcept] = useState<ConceptResult | null>(null);
  const [dualCodes, setDualCodes] = useState<any>(null);
  
  // Translation state
  const [sourceCode, setSourceCode] = useState("");
  const [sourceSystem, setSourceSystem] = useState("https://ayush.gov.in/fhir/CodeSystem/namaste");
  const [targetSystem, setTargetSystem] = useState("http://id.who.int/icd/release/11/mms");
  const [translationResults, setTranslationResults] = useState<any>(null);

  // Mock data for demonstration purposes
  const useMockData = true;

  // Handle search submission
  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setIsLoading(true);
    try {
      if (useMockData) {
        // Use mock data for demo
        setSearchResults(getMockSearchResults(searchTerm));
        setIsLoading(false);
        return;
      }
      
      // Build systems parameter
      const systemsParam = selectedSystems.join(',');
      
      const response = await fetch(
        `http://localhost:3000/fhir/terminology/$autocomplete?search=${encodeURIComponent(searchTerm)}&systems=${systemsParam}&limit=20&includeDesignations=true&includeMappings=true`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract results from FHIR Parameters
      const results: ConceptResult[] = [];
      
      // Process FHIR Parameters response
      const matchParams = data.parameter.filter((p: any) => p.name === 'match');
      
      matchParams.forEach((param: any) => {
        const codePart = param.part.find((p: any) => p.name === 'code');
        const scorePart = param.part.find((p: any) => p.name === 'score');
        const terminologyPart = param.part.find((p: any) => p.name === 'terminology');
        const definitionPart = param.part.find((p: any) => p.name === 'definition');
        const designationsPart = param.part.find((p: any) => p.name === 'designations');
        const mappingsPart = param.part.find((p: any) => p.name === 'mappings');
        
        if (codePart && codePart.valueCoding) {
          const result: ConceptResult = {
            system: codePart.valueCoding.system,
            systemName: getSystemName(codePart.valueCoding.system),
            code: codePart.valueCoding.code,
            display: codePart.valueCoding.display,
            score: scorePart ? scorePart.valueDecimal : 0,
            terminology: terminologyPart ? terminologyPart.valueString : 'UNKNOWN',
            definition: definitionPart ? definitionPart.valueString : undefined
          };
          
          // Parse designations if available
          if (designationsPart && designationsPart.valueString) {
            result.designations = parseDesignations(designationsPart.valueString);
          }
          
          // Parse mappings if available
          if (mappingsPart && mappingsPart.part) {
            result.mappings = parseMappings(mappingsPart.part);
          }
          
          results.push(result);
        }
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      // Show mock data on error for demo
      setSearchResults(getMockSearchResults(searchTerm));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle concept selection and dual code lookup
  const handleSelectConcept = async (concept: ConceptResult) => {
    setSelectedConcept(concept);
    setActiveTab("details");
    
    try {
      if (useMockData) {
        setDualCodes(getMockDualCodes(concept));
        return;
      }
      
      // Determine which parameter to use based on terminology
      const params = new URLSearchParams();
      if (concept.terminology === 'NAMASTE') {
        params.append('namasteCode', concept.code);
      } else if (concept.terminology === 'ICD11-TM2') {
        params.append('icd11Code', concept.code);
      }
      
      params.append('includeDetails', 'true');
      params.append('includeHierarchy', 'true');
      
      const response = await fetch(
        `http://localhost:3000/fhir/terminology/$dual-code-lookup?${params.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setDualCodes(data);
    } catch (error) {
      console.error('Dual code lookup failed:', error);
      setDualCodes(getMockDualCodes(concept));
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!sourceCode) return;
    
    setIsLoading(true);
    try {
      if (useMockData) {
        setTranslationResults(getMockTranslation(sourceCode, sourceSystem, targetSystem));
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(
        `http://localhost:3000/fhir/terminology/$translate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            resourceType: 'Parameters',
            parameter: [
              { name: 'code', valueCode: sourceCode },
              { name: 'system', valueUri: sourceSystem },
              { name: 'target', valueUri: targetSystem }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setTranslationResults(data);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslationResults(getMockTranslation(sourceCode, sourceSystem, targetSystem));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get human-readable system name
  const getSystemName = (systemUri: string): string => {
    const systemMap: Record<string, string> = {
      'https://ayush.gov.in/fhir/CodeSystem/namaste': 'NAMASTE',
      'https://ayush.gov.in/fhir/CodeSystem/unani': 'Unani',
      'http://id.who.int/icd/release/11/mms': 'ICD-11 TM2',
      'https://icd.who.int/browse11/l-m/en': 'ICD-11'
    };
    
    return systemMap[systemUri] || 'Unknown';
  };

  // Helper function to parse designations
  const parseDesignations = (designationsString: string): Designation[] => {
    return designationsString.split(';').map(entry => {
      const [language, value] = entry.trim().split(':');
      return {
        language: language.trim(),
        value: value.trim()
      };
    });
  };

  // Helper function to parse mappings
  const parseMappings = (mappingParts: any[]): Mapping[] => {
    return mappingParts.map(part => {
      const targetSystemPart = part.part.find((p: any) => p.name === 'targetSystem');
      const targetCodePart = part.part.find((p: any) => p.name === 'targetCode');
      const targetDisplayPart = part.part.find((p: any) => p.name === 'targetDisplay');
      const equivalencePart = part.part.find((p: any) => p.name === 'equivalence');
      const commentPart = part.part.find((p: any) => p.name === 'comment');
      
      return {
        targetSystem: targetSystemPart ? targetSystemPart.valueUri : '',
        targetCode: targetCodePart ? targetCodePart.valueCode : '',
        targetDisplay: targetDisplayPart ? targetDisplayPart.valueString : '',
        equivalence: equivalencePart ? equivalencePart.valueCode : 'equivalent',
        comment: commentPart ? commentPart.valueString : undefined
      };
    });
  };
  
  // Handle system selection change
  const toggleSystemSelection = (system: string) => {
    setSelectedSystems(current => 
      current.includes(system)
        ? current.filter(s => s !== system)
        : [...current, system]
    );
  };

  // Mock data helpers for demo mode
  const getMockSearchResults = (term: string): ConceptResult[] => {
    // Comprehensive set of mock data for different terminology systems
    const allMockData: ConceptResult[] = [
      // NAMASTE Dosha Concepts
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR11",
        display: "Vata Dosha",
        definition: "A fundamental bodily humor in Ayurveda representing the elements of air and ether. Governs movement, respiration, circulation and nervous system function.",
        score: 95,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "वात दोष" },
          { language: "sa", value: "वातदोष" },
          { language: "ta", value: "வாத தோஷம்" },
          { language: "te", value: "వాత దోషం" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM26.0",
            targetDisplay: "Disorders of vata dosha",
            equivalence: "equivalent"
          }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR12",
        display: "Pitta Dosha",
        definition: "A fundamental bodily humor in Ayurveda representing the elements of fire and water. Governs metabolism, digestion, and energy production.",
        score: 92,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "पित्त दोष" },
          { language: "sa", value: "पित्तदोष" },
          { language: "ta", value: "பித்த தோஷம்" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM27.0",
            targetDisplay: "Disorders of pitta dosha",
            equivalence: "equivalent"
          }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR13",
        display: "Kapha Dosha",
        definition: "A fundamental bodily humor in Ayurveda representing the elements of earth and water. Governs structure, stability, and fluid balance in the body.",
        score: 90,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "कफ दोष" },
          { language: "sa", value: "कफदोष" },
          { language: "ta", value: "கப தோஷம்" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM28.0",
            targetDisplay: "Disorders of kapha dosha",
            equivalence: "equivalent"
          }
        ]
      },
      
      // NAMASTE Combined Dosha Concepts
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR14",
        display: "Vata-Pitta Dosha",
        definition: "Combined disturbance of vata and pitta dosha. Manifests as pain, inflammation, hyperacidity, and neurological symptoms.",
        score: 85,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "वात-पित्त दोष" },
          { language: "sa", value: "वातपित्तदोष" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM26.1",
            targetDisplay: "Disorders of combined vata-pitta",
            equivalence: "equivalent"
          }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR15",
        display: "Pitta-Kapha Dosha",
        definition: "Combined disturbance of pitta and kapha dosha. Manifests as inflammatory conditions with excess mucus production and congestion.",
        score: 84,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "पित्त-कफ दोष" },
          { language: "sa", value: "पित्तकफदोष" }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "SR16",
        display: "Vata-Kapha Dosha",
        definition: "Combined disturbance of vata and kapha dosha. Manifests as conditions with pain, stiffness, and congestion.",
        score: 82,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "वात-कफ दोष" },
          { language: "sa", value: "वातकफदोष" }
        ]
      },
      
      // NAMASTE Diagnostic Concepts
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "DG101",
        display: "Amavata",
        definition: "Rheumatoid arthritis in Ayurvedic medicine. Characterized by pain, swelling and stiffness in joints with systemic manifestations.",
        score: 88,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "आमवात" },
          { language: "sa", value: "आमवात:" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM1.2",
            targetDisplay: "Amavata",
            equivalence: "equivalent"
          },
          {
            targetSystem: "https://icd.who.int/browse11/l-m/en",
            targetCode: "FA20.0",
            targetDisplay: "Rheumatoid arthritis",
            equivalence: "wider"
          }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "DG102",
        display: "Tamaka Swasa",
        definition: "Bronchial asthma in Ayurvedic medicine. Characterized by difficulty in breathing, wheezing, and cough.",
        score: 87,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "तमक श्वास" },
          { language: "sa", value: "तमकश्वास:" }
        ],
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM4.5",
            targetDisplay: "Tamaka Swasa",
            equivalence: "equivalent"
          },
          {
            targetSystem: "https://icd.who.int/browse11/l-m/en",
            targetCode: "CA23.0",
            targetDisplay: "Asthma",
            equivalence: "equivalent"
          }
        ]
      },
      
      // NAMASTE Treatment Concepts
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "TR203",
        display: "Panchakarma",
        definition: "Five detoxification and rejuvenation procedures in Ayurveda: Vamana (therapeutic emesis), Virechana (purgation), Basti (enema therapy), Nasya (nasal administration), and Raktamokshana (bloodletting).",
        score: 94,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "पंचकर्म" },
          { language: "sa", value: "पञ्चकर्म" }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
        systemName: "NAMASTE",
        code: "TR204",
        display: "Shirodhara",
        definition: "Ayurvedic therapy involving continuous pouring of warm oil or other liquids on the forehead. Used for stress, anxiety, and neurological conditions.",
        score: 89,
        terminology: "NAMASTE",
        designations: [
          { language: "hi", value: "शिरोधारा" },
          { language: "sa", value: "शिरोधारा" }
        ]
      },
      
      // ICD-11 TM2 (Traditional Medicine) concepts
      {
        system: "http://id.who.int/icd/release/11/mms",
        systemName: "ICD-11 TM2",
        code: "TM26.0",
        display: "Disorders of vata dosha",
        definition: "Conditions characterized by derangement of vata dosha manifesting as pain, dryness, emaciation, constipation, tremors, and anxiety.",
        score: 90,
        terminology: "ICD11-TM2",
        mappings: [
          {
            targetSystem: "https://ayush.gov.in/fhir/CodeSystem/namaste",
            targetCode: "SR11",
            targetDisplay: "Vata Dosha",
            equivalence: "equivalent"
          }
        ]
      },
      {
        system: "http://id.who.int/icd/release/11/mms",
        systemName: "ICD-11 TM2",
        code: "TM27.0",
        display: "Disorders of pitta dosha",
        definition: "Conditions characterized by derangement of pitta dosha manifesting as fever, inflammation, hyperacidity, and skin conditions.",
        score: 89,
        terminology: "ICD11-TM2",
        mappings: [
          {
            targetSystem: "https://ayush.gov.in/fhir/CodeSystem/namaste",
            targetCode: "SR12",
            targetDisplay: "Pitta Dosha",
            equivalence: "equivalent"
          }
        ]
      },
      {
        system: "http://id.who.int/icd/release/11/mms",
        systemName: "ICD-11 TM2",
        code: "TM1.2",
        display: "Amavata",
        definition: "An Ayurvedic condition similar to rheumatoid arthritis characterized by accumulation of ama (metabolic toxins) in joints causing inflammation and pain.",
        score: 87,
        terminology: "ICD11-TM2",
        mappings: [
          {
            targetSystem: "https://ayush.gov.in/fhir/CodeSystem/namaste",
            targetCode: "DG101",
            targetDisplay: "Amavata",
            equivalence: "equivalent"
          },
          {
            targetSystem: "https://icd.who.int/browse11/l-m/en",
            targetCode: "FA20.0",
            targetDisplay: "Rheumatoid arthritis",
            equivalence: "similar"
          }
        ]
      },
      
      // Unani concepts
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/unani",
        systemName: "Unani",
        code: "UN101",
        display: "Su-e-Mizaj",
        definition: "Abnormal temperament in Unani medicine. Refers to imbalance in the four humors (blood, phlegm, yellow bile, black bile).",
        score: 86,
        terminology: "Unani",
        designations: [
          { language: "ar", value: "سوء مزاج" },
          { language: "ur", value: "سوء مزاج" }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/unani",
        systemName: "Unani",
        code: "UN102",
        display: "Wajaul Mafasil",
        definition: "Joint pain or arthritis in Unani medicine. Characterized by pain, inflammation, and restricted movement of joints.",
        score: 84,
        terminology: "Unani",
        designations: [
          { language: "ar", value: "وجع المفاصل" },
          { language: "ur", value: "وجع المفاصل" }
        ],
        mappings: [
          {
            targetSystem: "https://icd.who.int/browse11/l-m/en",
            targetCode: "FA20",
            targetDisplay: "Inflammatory arthropathies",
            equivalence: "wider"
          }
        ]
      },
      {
        system: "https://ayush.gov.in/fhir/CodeSystem/unani",
        systemName: "Unani",
        code: "UN103",
        display: "Nazla-wa-Zukam",
        definition: "Common cold and rhinitis in Unani medicine. Characterized by nasal discharge, sneezing, and congestion.",
        score: 83,
        terminology: "Unani",
        designations: [
          { language: "ar", value: "نزلة و زکام" },
          { language: "ur", value: "نزلہ و زکام" }
        ],
        mappings: [
          {
            targetSystem: "https://icd.who.int/browse11/l-m/en",
            targetCode: "CA07",
            targetDisplay: "Common cold",
            equivalence: "equivalent"
          }
        ]
      },
      
      // ICD-11 concepts (non-traditional medicine)
      {
        system: "https://icd.who.int/browse11/l-m/en",
        systemName: "ICD-11",
        code: "FA20.0",
        display: "Rheumatoid arthritis",
        definition: "A chronic inflammatory disease affecting the joints, especially those of the hands and feet, causing pain, swelling, and deformity.",
        score: 82,
        terminology: "ICD-11",
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM1.2",
            targetDisplay: "Amavata",
            equivalence: "similar"
          },
          {
            targetSystem: "https://ayush.gov.in/fhir/CodeSystem/namaste",
            targetCode: "DG101",
            targetDisplay: "Amavata",
            equivalence: "similar"
          }
        ]
      },
      {
        system: "https://icd.who.int/browse11/l-m/en",
        systemName: "ICD-11",
        code: "CA23.0",
        display: "Asthma",
        definition: "A chronic respiratory condition characterized by inflammation and narrowing of airways causing wheezing, shortness of breath, chest tightness, and coughing.",
        score: 81,
        terminology: "ICD-11",
        mappings: [
          {
            targetSystem: "http://id.who.int/icd/release/11/mms",
            targetCode: "TM4.5",
            targetDisplay: "Tamaka Swasa",
            equivalence: "equivalent"
          },
          {
            targetSystem: "https://ayush.gov.in/fhir/CodeSystem/namaste",
            targetCode: "DG102",
            targetDisplay: "Tamaka Swasa",
            equivalence: "equivalent"
          }
        ]
      }
    ];
    
    // If search term is empty or very short, return limited results
    if (!term || term.length < 2) {
      return allMockData.slice(0, 3);
    }
    
    // Filter based on search term to simulate search
    const filteredResults = allMockData.filter(r => 
      r.code.toLowerCase().includes(term.toLowerCase()) || 
      r.display.toLowerCase().includes(term.toLowerCase()) ||
      (r.definition && r.definition.toLowerCase().includes(term.toLowerCase()))
    );
    
    // Sort by score and limit results
    return filteredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  };

  const getMockDualCodes = (concept: ConceptResult): any => {
    // NAMASTE Concepts
    if (concept.terminology === 'NAMASTE') {
      // Different responses based on concept code
      switch(concept.code) {
        case 'SR11': // Vata Dosha
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "namaste",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                      code: "SR11",
                      display: "Vata Dosha"
                    }
                  },
                  {
                    name: "definition",
                    valueString: "A fundamental bodily humor in Ayurveda representing the elements of air and ether. Governs movement, respiration, circulation and nervous system function."
                  },
                  {
                    name: "properties",
                    part: [
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "nature" },
                          { name: "value", valueString: "dry, light, cold, rough, subtle, mobile" }
                        ]
                      },
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "location" },
                          { name: "value", valueString: "colon, thighs, hips, ears, bones, skin" }
                        ]
                      },
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "function" },
                          { name: "value", valueString: "movement, breathing, natural urges, transformations in tissues" }
                        ]
                      }
                    ]
                  },
                  {
                    name: "designations",
                    valueString: "hi: वात दोष; sa: वातदोष; ta: வாத தோஷம்; te: వాత దోషం"
                  },
                  {
                    name: "hierarchy",
                    part: [
                      {
                        name: "parent",
                        valueCoding: {
                          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                          code: "SR10",
                          display: "Tridosha"
                        }
                      },
                      {
                        name: "children",
                        part: [
                          {
                            name: "child",
                            valueCoding: {
                              system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                              code: "SR11.1",
                              display: "Prana Vata"
                            }
                          },
                          {
                            name: "child",
                            valueCoding: {
                              system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                              code: "SR11.2",
                              display: "Udana Vata"
                            }
                          },
                          {
                            name: "child",
                            valueCoding: {
                              system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                              code: "SR11.3",
                              display: "Samana Vata"
                            }
                          },
                          {
                            name: "child",
                            valueCoding: {
                              system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                              code: "SR11.4",
                              display: "Vyana Vata"
                            }
                          },
                          {
                            name: "child",
                            valueCoding: {
                              system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                              code: "SR11.5",
                              display: "Apana Vata"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "mappedIcd11Codes",
                part: [
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM26.0",
                          display: "Disorders of vata dosha"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "equivalent"
                      },
                      {
                        name: "comment",
                        valueString: "Mapping validated by domain experts and WHO TM2 committee"
                      }
                    ]
                  },
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM26.10",
                          display: "Vata vriddhi (Aggravation of vata)"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "narrower"
                      }
                    ]
                  },
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM26.11",
                          display: "Vata kshaya (Diminution of vata)"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "narrower"
                      }
                    ]
                  }
                ]
              }
            ]
          };
        
        case 'DG101': // Amavata
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "namaste",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                      code: "DG101",
                      display: "Amavata"
                    }
                  },
                  {
                    name: "definition",
                    valueString: "Rheumatoid arthritis in Ayurvedic medicine. Characterized by pain, swelling and stiffness in joints with systemic manifestations."
                  },
                  {
                    name: "properties",
                    part: [
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "etiology" },
                          { name: "value", valueString: "Consumption of incompatible food, sedentary lifestyle, impaired digestion" }
                        ]
                      },
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "symptoms" },
                          { name: "value", valueString: "Joint pain, swelling, stiffness, restricted movement, fever, fatigue" }
                        ]
                      }
                    ]
                  },
                  {
                    name: "designations",
                    valueString: "hi: आमवात; sa: आमवात:"
                  }
                ]
              },
              {
                name: "mappedIcd11Codes",
                part: [
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM1.2",
                          display: "Amavata"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "equivalent"
                      }
                    ]
                  },
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "https://icd.who.int/browse11/l-m/en",
                          code: "FA20.0",
                          display: "Rheumatoid arthritis"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "wider"
                      },
                      {
                        name: "comment",
                        valueString: "Western medicine concept encompasses broader range of conditions"
                      }
                    ]
                  }
                ]
              }
            ]
          };
        
        default: // Generic response for other NAMASTE codes
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "namaste",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                      code: concept.code,
                      display: concept.display
                    }
                  },
                  {
                    name: "definition",
                    valueString: concept.definition || "Definition not available"
                  },
                  {
                    name: "designations",
                    valueString: concept.designations ? concept.designations.map(d => `${d.language}: ${d.value}`).join('; ') : ""
                  }
                ]
              },
              {
                name: "mappedIcd11Codes",
                part: concept.mappings && concept.mappings.length > 0 ? 
                  concept.mappings.filter(m => m.targetSystem.includes('icd')).map(mapping => ({
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: mapping.targetSystem,
                          code: mapping.targetCode,
                          display: mapping.targetDisplay
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: mapping.equivalence
                      }
                    ]
                  })) : []
              }
            ]
          };
      }
    } 
    // ICD-11 TM2 Concepts
    else if (concept.terminology === 'ICD11-TM2') {
      switch(concept.code) {
        case 'TM26.0': // Disorders of vata dosha
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "icd11",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "http://id.who.int/icd/release/11/mms",
                      code: "TM26.0",
                      display: "Disorders of vata dosha"
                    }
                  },
                  {
                    name: "definition",
                    valueString: "Conditions characterized by derangement of vata dosha manifesting as pain, dryness, emaciation, constipation, tremors, and anxiety."
                  },
                  {
                    name: "properties",
                    part: [
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "clinical_features" },
                          { name: "value", valueString: "Pain, stiffness, dryness, crackling joints, constipation, tremors, insomnia" }
                        ]
                      },
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "inclusion" },
                          { name: "value", valueString: "Vata vriddhi (Aggravation of vata), Vata prakopa (Provocation of vata)" }
                        ]
                      }
                    ]
                  },
                  {
                    name: "hierarchy",
                    part: [
                      {
                        name: "parent",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM26",
                          display: "Disorders of dosha"
                        }
                      },
                      {
                        name: "children",
                        part: [
                          {
                            name: "child",
                            valueCoding: {
                              system: "http://id.who.int/icd/release/11/mms",
                              code: "TM26.10",
                              display: "Vata vriddhi (Aggravation of vata)"
                            }
                          },
                          {
                            name: "child",
                            valueCoding: {
                              system: "http://id.who.int/icd/release/11/mms",
                              code: "TM26.11",
                              display: "Vata kshaya (Diminution of vata)"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "mappedNamasteCodes",
                part: [
                  {
                    name: "reverseMapping",
                    part: [
                      {
                        name: "sourceCode",
                        valueCoding: {
                          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                          code: "SR11",
                          display: "Vata Dosha"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "equivalent"
                      },
                      {
                        name: "comment",
                        valueString: "Primary mapping for disorders of vata dosha"
                      }
                    ]
                  },
                  {
                    name: "reverseMapping",
                    part: [
                      {
                        name: "sourceCode",
                        valueCoding: {
                          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                          code: "SR14",
                          display: "Vata-Pitta Dosha"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "wider"
                      }
                    ]
                  },
                  {
                    name: "reverseMapping",
                    part: [
                      {
                        name: "sourceCode",
                        valueCoding: {
                          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                          code: "SR16",
                          display: "Vata-Kapha Dosha"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "wider"
                      }
                    ]
                  }
                ]
              }
            ]
          };
          
        case 'TM1.2': // Amavata
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "icd11",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "http://id.who.int/icd/release/11/mms",
                      code: "TM1.2",
                      display: "Amavata"
                    }
                  },
                  {
                    name: "definition",
                    valueString: "An Ayurvedic condition similar to rheumatoid arthritis characterized by accumulation of ama (metabolic toxins) in joints causing inflammation and pain."
                  },
                  {
                    name: "properties",
                    part: [
                      {
                        name: "property",
                        part: [
                          { name: "code", valueString: "clinical_features" },
                          { name: "value", valueString: "Joint pain, swelling, stiffness, loss of function, morning stiffness, systemic manifestations" }
                        ]
                      }
                    ]
                  },
                  {
                    name: "hierarchy",
                    part: [
                      {
                        name: "parent",
                        valueCoding: {
                          system: "http://id.who.int/icd/release/11/mms",
                          code: "TM1",
                          display: "Disorders of musculoskeletal system"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                name: "mappedNamasteCodes",
                part: [
                  {
                    name: "reverseMapping",
                    part: [
                      {
                        name: "sourceCode",
                        valueCoding: {
                          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",
                          code: "DG101",
                          display: "Amavata"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "equivalent"
                      }
                    ]
                  }
                ]
              },
              {
                name: "icdMappings",
                part: [
                  {
                    name: "mapping",
                    part: [
                      {
                        name: "targetCode",
                        valueCoding: {
                          system: "https://icd.who.int/browse11/l-m/en",
                          code: "FA20.0",
                          display: "Rheumatoid arthritis"
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: "similar"
                      },
                      {
                        name: "comment",
                        valueString: "Concepts share significant overlap but have distinct theoretical foundations"
                      }
                    ]
                  }
                ]
              }
            ]
          };
          
        default: // Generic response for other ICD-11 TM2 codes
          return {
            resourceType: "Parameters",
            parameter: [
              {
                name: "result",
                valueBoolean: true
              },
              {
                name: "icd11",
                part: [
                  {
                    name: "code",
                    valueCoding: {
                      system: "http://id.who.int/icd/release/11/mms",
                      code: concept.code,
                      display: concept.display
                    }
                  },
                  {
                    name: "definition",
                    valueString: concept.definition || "ICD-11 TM2 definition for this disorder"
                  }
                ]
              },
              {
                name: "mappedNamasteCodes",
                part: concept.mappings && concept.mappings.length > 0 ? 
                  concept.mappings.filter(m => m.targetSystem.includes('namaste')).map(mapping => ({
                    name: "reverseMapping",
                    part: [
                      {
                        name: "sourceCode",
                        valueCoding: {
                          system: mapping.targetSystem,
                          code: mapping.targetCode,
                          display: mapping.targetDisplay
                        }
                      },
                      {
                        name: "equivalence",
                        valueCode: mapping.equivalence
                      }
                    ]
                  })) : []
              }
            ]
          };
      }
    }
    // Unani Concepts
    else if (concept.terminology === 'Unani') {
      return {
        resourceType: "Parameters",
        parameter: [
          {
            name: "result",
            valueBoolean: true
          },
          {
            name: "unani",
            part: [
              {
                name: "code",
                valueCoding: {
                  system: "https://ayush.gov.in/fhir/CodeSystem/unani",
                  code: concept.code,
                  display: concept.display
                }
              },
              {
                name: "definition",
                valueString: concept.definition || "Definition not available"
              },
              {
                name: "properties",
                part: [
                  {
                    name: "property",
                    part: [
                      { name: "code", valueString: "temperament" },
                      { name: "value", valueString: concept.code === 'UN101' ? "Abnormal temperament" : "Variable" }
                    ]
                  }
                ]
              },
              {
                name: "designations",
                valueString: concept.designations ? concept.designations.map(d => `${d.language}: ${d.value}`).join('; ') : ""
              }
            ]
          },
          {
            name: "mappedIcdCodes",
            part: concept.mappings && concept.mappings.length > 0 ? 
              concept.mappings.map(mapping => ({
                name: "mapping",
                part: [
                  {
                    name: "targetCode",
                    valueCoding: {
                      system: mapping.targetSystem,
                      code: mapping.targetCode,
                      display: mapping.targetDisplay
                    }
                  },
                  {
                    name: "equivalence",
                    valueCode: mapping.equivalence
                  }
                ]
              })) : []
          }
        ]
      };
    }
    // ICD-11 (standard) concepts
    else {
      return {
        resourceType: "Parameters",
        parameter: [
          {
            name: "result",
            valueBoolean: true
          },
          {
            name: "icd11Standard",
            part: [
              {
                name: "code",
                valueCoding: {
                  system: "https://icd.who.int/browse11/l-m/en",
                  code: concept.code,
                  display: concept.display
                }
              },
              {
                name: "definition",
                valueString: concept.definition || "Standard ICD-11 definition for this disorder"
              },
              {
                name: "properties",
                part: [
                  {
                    name: "property",
                    part: [
                      { name: "code", valueString: "inclusion" },
                      { name: "value", valueString: concept.code === 'FA20.0' ? 
                        "Rheumatoid arthritis, seronegative; Rheumatoid arthritis, seropositive" : 
                        "Inclusions not specified" 
                      }
                    ]
                  },
                  {
                    name: "property",
                    part: [
                      { name: "code", valueString: "exclusion" },
                      { name: "value", valueString: concept.code === 'FA20.0' ? 
                        "Juvenile rheumatoid arthritis (FA20.1)" : 
                        "Exclusions not specified" 
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "mappedTraditionalCodes",
            part: concept.mappings && concept.mappings.length > 0 ? 
              concept.mappings.map(mapping => ({
                name: "mapping",
                part: [
                  {
                    name: "targetCode",
                    valueCoding: {
                      system: mapping.targetSystem,
                      code: mapping.targetCode,
                      display: mapping.targetDisplay
                    }
                  },
                  {
                    name: "equivalence",
                    valueCode: mapping.equivalence
                  },
                  {
                    name: "comment",
                    valueString: "Mapping between conventional and traditional medicine systems"
                  }
                ]
              })) : []
          }
        ]
      };
    }
  };

  const getMockTranslation = (code: string, system: string, target: string): any => {
    // Define common concept mappings for mock data
    const conceptMappings: {[key: string]: {
      code: string,
      display: string,
      system: string,
      matches: Array<{
        system: string,
        code: string,
        display: string,
        equivalence: string,
        comment?: string
      }>
    }} = {
      // NAMASTE concepts
      'SR11': {
        code: 'SR11',
        display: 'Vata Dosha',
        system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
        matches: [
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM26.0',
            display: 'Disorders of vata dosha',
            equivalence: 'equivalent',
            comment: 'Mapping validated by domain experts'
          },
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM26.10',
            display: 'Vata vriddhi (Aggravation of vata)',
            equivalence: 'narrower'
          }
        ]
      },
      'SR12': {
        code: 'SR12',
        display: 'Pitta Dosha',
        system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
        matches: [
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM27.0',
            display: 'Disorders of pitta dosha',
            equivalence: 'equivalent',
            comment: 'Mapping validated by domain experts'
          }
        ]
      },
      'SR13': {
        code: 'SR13',
        display: 'Kapha Dosha',
        system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
        matches: [
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM28.0',
            display: 'Disorders of kapha dosha',
            equivalence: 'equivalent',
            comment: 'Mapping validated by domain experts'
          }
        ]
      },
      'DG101': {
        code: 'DG101',
        display: 'Amavata',
        system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
        matches: [
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM1.2',
            display: 'Amavata',
            equivalence: 'equivalent'
          },
          {
            system: 'https://icd.who.int/browse11/l-m/en',
            code: 'FA20.0',
            display: 'Rheumatoid arthritis',
            equivalence: 'wider',
            comment: 'Western medicine concept with broader scope'
          }
        ]
      },
      'DG102': {
        code: 'DG102',
        display: 'Tamaka Swasa',
        system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
        matches: [
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM4.5',
            display: 'Tamaka Swasa',
            equivalence: 'equivalent'
          },
          {
            system: 'https://icd.who.int/browse11/l-m/en',
            code: 'CA23.0',
            display: 'Asthma',
            equivalence: 'equivalent',
            comment: 'Conceptually equivalent in different medical systems'
          }
        ]
      },
      
      // ICD-11 TM2 concepts
      'TM26.0': {
        code: 'TM26.0',
        display: 'Disorders of vata dosha',
        system: 'http://id.who.int/icd/release/11/mms',
        matches: [
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
            code: 'SR11',
            display: 'Vata Dosha',
            equivalence: 'equivalent',
            comment: 'Core Ayurvedic concept mapping'
          }
        ]
      },
      'TM27.0': {
        code: 'TM27.0',
        display: 'Disorders of pitta dosha',
        system: 'http://id.who.int/icd/release/11/mms',
        matches: [
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
            code: 'SR12',
            display: 'Pitta Dosha',
            equivalence: 'equivalent'
          }
        ]
      },
      'TM1.2': {
        code: 'TM1.2',
        display: 'Amavata',
        system: 'http://id.who.int/icd/release/11/mms',
        matches: [
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
            code: 'DG101',
            display: 'Amavata',
            equivalence: 'equivalent'
          },
          {
            system: 'https://icd.who.int/browse11/l-m/en',
            code: 'FA20.0',
            display: 'Rheumatoid arthritis',
            equivalence: 'similar',
            comment: 'Concepts share similar clinical presentations but have different theoretical foundations'
          }
        ]
      },
      
      // ICD-11 concepts
      'FA20.0': {
        code: 'FA20.0',
        display: 'Rheumatoid arthritis',
        system: 'https://icd.who.int/browse11/l-m/en',
        matches: [
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
            code: 'DG101',
            display: 'Amavata',
            equivalence: 'narrower',
            comment: 'Traditional medicine concept with specific pathophysiology'
          },
          {
            system: 'http://id.who.int/icd/release/11/mms',
            code: 'TM1.2',
            display: 'Amavata',
            equivalence: 'similar'
          },
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/unani',
            code: 'UN102',
            display: 'Wajaul Mafasil',
            equivalence: 'narrower',
            comment: 'Unani concept specific to joint inflammation'
          }
        ]
      },
      'CA23.0': {
        code: 'CA23.0',
        display: 'Asthma',
        system: 'https://icd.who.int/browse11/l-m/en',
        matches: [
          {
            system: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
            code: 'DG102',
            display: 'Tamaka Swasa',
            equivalence: 'equivalent'
          }
        ]
      },
      
      // Unani concepts
      'UN101': {
        code: 'UN101',
        display: 'Su-e-Mizaj',
        system: 'https://ayush.gov.in/fhir/CodeSystem/unani',
        matches: []  // No direct mappings for this concept
      },
      'UN102': {
        code: 'UN102',
        display: 'Wajaul Mafasil',
        system: 'https://ayush.gov.in/fhir/CodeSystem/unani',
        matches: [
          {
            system: 'https://icd.who.int/browse11/l-m/en',
            code: 'FA20',
            display: 'Inflammatory arthropathies',
            equivalence: 'wider'
          }
        ]
      }
    };
    
    // Default concept for codes not in our mapping
    const defaultConcept = {
      code: code || 'SR11',
      display: 'Unknown Concept',
      system: system || 'https://ayush.gov.in/fhir/CodeSystem/namaste',
      matches: [{
        system: target || 'http://id.who.int/icd/release/11/mms',
        code: 'TM0.0',
        display: 'Default target concept',
        equivalence: 'equivalent'
      }]
    };
    
    // Get the concept data or use default
    const conceptData = conceptMappings[code] || defaultConcept;
    
    // If we have source concept data but no matches for the target system, return no matches
    if (conceptData && conceptData.matches.length === 0) {
      return {
        resourceType: "Parameters",
        parameter: [
          {
            name: "result",
            valueBoolean: false
          },
          {
            name: "source",
            valueCoding: {
              system: conceptData.system,
              code: conceptData.code,
              display: conceptData.display
            }
          },
          {
            name: "message",
            valueString: "No translation available for this concept to the target system"
          }
        ]
      };
    }
    
    // Filter matches to only those for the requested target system
    const targetMatches = conceptData.matches.filter(match => match.system === target);
    
    // If no matches for the specific target system, return no matches
    if (targetMatches.length === 0) {
      return {
        resourceType: "Parameters",
        parameter: [
          {
            name: "result",
            valueBoolean: false
          },
          {
            name: "source",
            valueCoding: {
              system: conceptData.system,
              code: conceptData.code,
              display: conceptData.display
            }
          },
          {
            name: "message",
            valueString: `No translation available from ${getSystemName(conceptData.system)} to ${getSystemName(target)}`
          }
        ]
      };
    }
    
    // Return the translation results
    return {
      resourceType: "Parameters",
      parameter: [
        {
          name: "result",
          valueBoolean: true
        },
        {
          name: "source",
          valueCoding: {
            system: conceptData.system,
            code: conceptData.code,
            display: conceptData.display
          }
        },
        ...targetMatches.map(match => ({
          name: "match",
          part: [
            {
              name: "equivalence",
              valueCode: match.equivalence
            },
            {
              name: "concept",
              valueCoding: {
                system: match.system,
                code: match.code,
                display: match.display
              }
            },
            ...(match.comment ? [{
              name: "comment",
              valueString: match.comment
            }] : [])
          ]
        }))
      ]
    };
  };

  // Effect to automatically search when tab changes to search
  useEffect(() => {
    if (activeTab === "search" && searchTerm.length >= 2) {
      handleSearch();
    }
  }, [activeTab, selectedSystems]);

  return (
    <div>
      {/* Hero Section with Sofax Background */}
      <SofaxBackground>
        <Header />
        <div className="container mx-auto px-6 py-4 lg:py-6">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3">
              Terminology <span className="sofax-text-gradient">Explorer</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">
              Search, translate, and explore NAMASTE, ICD-11, and traditional medicine terminology systems
            </p>
            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mt-4 max-w-3xl mx-auto">
              <p className="text-sm text-white/80">
                <strong>Demo Mode:</strong> Currently displaying sample terminology data. In production, this would connect to the AyushBridge terminology service API.
              </p>
            </div>
          </div>
        </div>
      </SofaxBackground>

      {/* Main Content */}
      <div className="bg-background">
        <div className="container mx-auto px-6 py-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="translate">Translate</TabsTrigger>
            </TabsList>
            
            {/* Search Tab */}
            <TabsContent value="search">
              <Card className="sofax-glass mb-8">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Search Terminology</h2>
                    
                    {/* Search Box */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <Input
                          type="text"
                          placeholder="Search for code, term, or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <Button 
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                      >
                        {isLoading ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    
                    {/* System Selection */}
                    <div>
                      <p className="text-sm text-white/80 mb-2">Select terminology systems:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={selectedSystems.includes('namaste') ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => toggleSystemSelection('namaste')}
                        >
                          NAMASTE
                        </Badge>
                        <Badge 
                          variant={selectedSystems.includes('icd11-tm2') ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => toggleSystemSelection('icd11-tm2')}
                        >
                          ICD-11 TM2
                        </Badge>
                        <Badge 
                          variant={selectedSystems.includes('unani') ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => toggleSystemSelection('unani')}
                        >
                          Unani
                        </Badge>
                        <Badge 
                          variant={selectedSystems.includes('icd11') ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => toggleSystemSelection('icd11')}
                        >
                          ICD-11
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <Card className="sofax-glass">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Search Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <Card 
                          key={`${result.system}-${result.code}`}
                          className="bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-white/10"
                          onClick={() => handleSelectConcept(result)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-primary/80">{result.terminology}</Badge>
                                  <span className="text-white font-mono">{result.code}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white">{result.display}</h3>
                                {result.definition && (
                                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{result.definition}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                {result.mappings && result.mappings.length > 0 && (
                                  <Badge variant="outline" className="mt-2 border-green-500/50 text-green-400">
                                    Has mappings
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {searchTerm && searchResults.length === 0 && !isLoading && (
                <Card className="sofax-glass">
                  <CardContent className="p-8 text-center">
                    <p className="text-white/70">No results found for "{searchTerm}"</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Details Tab */}
            <TabsContent value="details">
              {selectedConcept ? (
                <div className="space-y-8">
                  {/* Primary Concept Information */}
                  <Card className="sofax-glass">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/80">{selectedConcept.terminology}</Badge>
                        <CardTitle className="text-xl font-bold text-white">{selectedConcept.display}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-white/50 text-sm mb-1">Code</p>
                            <p className="text-white font-mono">{selectedConcept.code}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-sm mb-1">System</p>
                            <p className="text-white">{selectedConcept.systemName}</p>
                          </div>
                        </div>
                        
                        {selectedConcept.definition && (
                          <div>
                            <p className="text-white/50 text-sm mb-1">Definition</p>
                            <p className="text-white">{selectedConcept.definition}</p>
                          </div>
                        )}
                        
                        {selectedConcept.designations && selectedConcept.designations.length > 0 && (
                          <div>
                            <p className="text-white/50 text-sm mb-1">Translations & Designations</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedConcept.designations.map((d, i) => (
                                <div key={i} className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">{d.language}</Badge>
                                  <span className="text-white">{d.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Mappings & Related Codes */}
                  {((selectedConcept.mappings && selectedConcept.mappings.length > 0) || dualCodes) && (
                    <Card className="sofax-glass">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Mappings & Related Codes</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {dualCodes && dualCodes.parameter && (
                            <>
                              {dualCodes.parameter.find((p: any) => p.name === 'mappedIcd11Codes') && (
                                <div>
                                  <h3 className="text-white font-semibold mb-2">ICD-11 Mappings</h3>
                                  <div className="space-y-3">
                                    {dualCodes.parameter
                                      .find((p: any) => p.name === 'mappedIcd11Codes')
                                      .part.map((m: any, i: number) => {
                                        const targetCode = m.part.find((p: any) => p.name === 'targetCode');
                                        const equivalence = m.part.find((p: any) => p.name === 'equivalence');
                                        
                                        return (
                                          <div key={i} className="bg-white/5 border border-white/10 rounded-md p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge className="bg-blue-700/80">ICD-11 TM2</Badge>
                                              <span className="text-white font-mono">{targetCode.valueCoding.code}</span>
                                            </div>
                                            <p className="text-white">{targetCode.valueCoding.display}</p>
                                            {equivalence && (
                                              <div className="mt-2">
                                                <Badge variant="outline" className="text-xs border-white/20">
                                                  {equivalence.valueCode}
                                                </Badge>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                              
                              {dualCodes.parameter.find((p: any) => p.name === 'mappedNamasteCodes') && (
                                <div>
                                  <h3 className="text-white font-semibold mb-2">NAMASTE Mappings</h3>
                                  <div className="space-y-3">
                                    {dualCodes.parameter
                                      .find((p: any) => p.name === 'mappedNamasteCodes')
                                      .part.map((m: any, i: number) => {
                                        const sourceCode = m.part.find((p: any) => p.name === 'sourceCode');
                                        const equivalence = m.part.find((p: any) => p.name === 'equivalence');
                                        
                                        return (
                                          <div key={i} className="bg-white/5 border border-white/10 rounded-md p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge className="bg-orange-600/80">NAMASTE</Badge>
                                              <span className="text-white font-mono">{sourceCode.valueCoding.code}</span>
                                            </div>
                                            <p className="text-white">{sourceCode.valueCoding.display}</p>
                                            {equivalence && (
                                              <div className="mt-2">
                                                <Badge variant="outline" className="text-xs border-white/20">
                                                  {equivalence.valueCode}
                                                </Badge>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          
                          {!dualCodes && selectedConcept.mappings && selectedConcept.mappings.length > 0 && (
                            <div className="space-y-3">
                              {selectedConcept.mappings.map((mapping, index) => (
                                <div key={index} className="bg-white/5 border border-white/10 rounded-md p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-blue-700/80">{getSystemName(mapping.targetSystem)}</Badge>
                                    <span className="text-white font-mono">{mapping.targetCode}</span>
                                  </div>
                                  <p className="text-white">{mapping.targetDisplay}</p>
                                  <div className="mt-2 flex gap-2">
                                    <Badge variant="outline" className="text-xs border-white/20">
                                      {mapping.equivalence}
                                    </Badge>
                                    {mapping.comment && (
                                      <span className="text-white/70 text-xs">{mapping.comment}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => setActiveTab("search")}
                    >
                      Back to Search
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="sofax-glass">
                  <CardContent className="p-8 text-center">
                    <p className="text-white/70">Select a concept from search results to view details</p>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 mt-4"
                      onClick={() => setActiveTab("search")}
                    >
                      Go to Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Translation Tab */}
            <TabsContent value="translate">
              <Card className="sofax-glass mb-8">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Translate Between Terminology Systems</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Source System</label>
                          <Select
                            value={sourceSystem}
                            onValueChange={setSourceSystem}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select source system" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="https://ayush.gov.in/fhir/CodeSystem/namaste">NAMASTE</SelectItem>
                              <SelectItem value="http://id.who.int/icd/release/11/mms">ICD-11 TM2</SelectItem>
                              <SelectItem value="https://ayush.gov.in/fhir/CodeSystem/unani">Unani</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Source Code</label>
                          <Input
                            type="text"
                            placeholder="Enter code to translate (e.g., SR11)"
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder-white/50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-white/80 mb-2 block">Target System</label>
                          <Select
                            value={targetSystem}
                            onValueChange={setTargetSystem}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select target system" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="http://id.who.int/icd/release/11/mms">ICD-11 TM2</SelectItem>
                              <SelectItem value="https://icd.who.int/browse11/l-m/en">ICD-11</SelectItem>
                              <SelectItem value="https://ayush.gov.in/fhir/CodeSystem/namaste">NAMASTE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end h-10 mt-8">
                          <Button 
                            onClick={handleTranslate}
                            disabled={isLoading || !sourceCode}
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            {isLoading ? 'Translating...' : 'Translate Code'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Translation Results */}
              {translationResults && (
                <Card className="sofax-glass">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Translation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {translationResults.parameter.find((p: any) => p.name === 'result')?.valueBoolean === true ? (
                      <div className="space-y-6">
                        {/* Source */}
                        <div>
                          <h3 className="text-white font-semibold mb-2">Source</h3>
                          <div className="bg-white/5 border border-white/10 rounded-md p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-orange-600/80">{getSystemName(translationResults.parameter.find((p: any) => p.name === 'source').valueCoding.system)}</Badge>
                              <span className="text-white font-mono">{translationResults.parameter.find((p: any) => p.name === 'source').valueCoding.code}</span>
                            </div>
                            <p className="text-white">{translationResults.parameter.find((p: any) => p.name === 'source').valueCoding.display}</p>
                          </div>
                        </div>
                        
                        {/* Target Mappings */}
                        <div>
                          <h3 className="text-white font-semibold mb-2">Target Mappings</h3>
                          <div className="space-y-3">
                            {translationResults.parameter
                              .filter((p: any) => p.name === 'match')
                              .map((match: any, index: number) => {
                                const concept = match.part.find((p: any) => p.name === 'concept');
                                const equivalence = match.part.find((p: any) => p.name === 'equivalence');
                                const comment = match.part.find((p: any) => p.name === 'comment');
                                
                                return (
                                  <div key={index} className="bg-white/5 border border-white/10 rounded-md p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-blue-700/80">{getSystemName(concept.valueCoding.system)}</Badge>
                                      <span className="text-white font-mono">{concept.valueCoding.code}</span>
                                    </div>
                                    <p className="text-white">{concept.valueCoding.display}</p>
                                    <div className="mt-2 flex gap-2 items-center flex-wrap">
                                      <Badge variant="outline" className="text-xs border-white/20">
                                        {equivalence.valueCode}
                                      </Badge>
                                      {comment && (
                                        <span className="text-white/70 text-xs">{comment.valueString}</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
                        <p className="text-white/70">
                          No translation found for code &quot;{sourceCode}&quot; from {getSystemName(sourceSystem)} to {getSystemName(targetSystem)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
