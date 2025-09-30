/**
 * Additional routes to handle specific API Explorer calls
 * This module adds GET endpoints for translation operations
 */

const express = require('express');
const { asyncHandler, ValidationError } = require('../middleware/errorHandler');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /fhir/ConceptMap/namaste-to-icd11/$translate - Handle GET requests for translation
 * This specifically handles requests from the API playground
 */
router.get('/namaste-to-icd11/$translate', asyncHandler(async (req, res) => {
  // Extract parameters from query string - provide defaults for API explorer
  const { code, system: requestedSystem } = req.query;
  
  // Set defaults or use provided values
  const system = requestedSystem || 'https://ayush.gov.in/fhir/CodeSystem/namaste';
  const target = 'http://id.who.int/icd/release/11/mms';

  // For API Explorer requests, we'll use a sample code if none provided
  const codeToUse = code || 'Y01.AC';

  console.log(`GET translation request: code=${codeToUse}, system=${system}, target=${target}`);

  // Find the source concept
  const sourceConcept = await prisma.codeSystemConcept.findFirst({
    where: {
      code: codeToUse,
      codeSystem: {
        url: system
      }
    },
    include: {
      codeSystem: true,
      designations: true
    }
  });

  if (!sourceConcept) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `Code '${codeToUse}' not found in system '${system}'`
      }]
    });
  }

  // Find the ConceptMap for NAMASTE to ICD11
  const conceptMap = await prisma.conceptMap.findFirst({
    where: {
      sourceUri: system,
      targetUri: target
    },
    include: {
      groups: {
        include: {
          elements: {
            where: { code: codeToUse },
            include: {
              targets: true
            }
          }
        }
      }
    }
  });

  if (!conceptMap || !conceptMap.groups.length) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No ConceptMap found for translating from '${system}' to '${target}'`
      }]
    });
  }

  // Collect all mappings
  const mappings = [];
  for (const group of conceptMap.groups) {
    for (const element of group.elements) {
      for (const target of element.targets) {
        mappings.push({
          targetSystem: conceptMap.targetUri,
          targetCode: target.code,
          targetDisplay: target.display,
          equivalence: target.equivalence,
          comment: target.comment
        });
      }
    }
  }

  if (mappings.length === 0) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No mappings found for code '${codeToUse}' from '${system}' to '${target}'`
      }]
    });
  }

  // Build response
  const response = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: true
      },
      {
        name: 'source',
        valueCoding: {
          system: sourceConcept.codeSystem.url,
          code: sourceConcept.code,
          display: sourceConcept.display
        }
      },
      ...mappings.map(mapping => ({
        name: 'match',
        part: [
          {
            name: 'equivalence',
            valueCode: mapping.equivalence
          },
          {
            name: 'concept',
            valueCoding: {
              system: mapping.targetSystem,
              code: mapping.targetCode,
              display: mapping.targetDisplay
            }
          },
          ...(mapping.comment ? [{
            name: 'comment',
            valueString: mapping.comment
          }] : [])
        ]
      }))
    ]
  };

  res.json(response);
}));

/**
 * POST /fhir/ConceptMap/namaste-to-icd11/$translate - Handle POST requests for translation 
 * This handles direct API calls with a JSON body
 */
router.post('/namaste-to-icd11/$translate', asyncHandler(async (req, res) => {
  // Try different ways to parse the parameters
  let code, system, target;

  // Option 1: FHIR Parameters resource
  if (req.body?.resourceType === 'Parameters' && req.body?.parameter && Array.isArray(req.body.parameter)) {
    const paramMap = req.body.parameter.reduce((acc, param) => {
      acc[param.name] = param.valueCode || param.valueUri || param.valueString;
      return acc;
    }, {});
    code = paramMap.code;
    system = paramMap.system || 'https://ayush.gov.in/fhir/CodeSystem/namaste';
    target = paramMap.target || 'http://id.who.int/icd/release/11/mms';
  } 
  // Option 2: Simple JSON object
  else if (req.body) {
    code = req.body.code || 'Y01.AC'; // Default value for API Explorer
    system = req.body.system || 'https://ayush.gov.in/fhir/CodeSystem/namaste';
    target = req.body.target || 'http://id.who.int/icd/release/11/mms';
  }

  console.log(`POST translation request: code=${code}, system=${system}, target=${target}`);

  // Find the source concept
  const sourceConcept = await prisma.codeSystemConcept.findFirst({
    where: {
      code,
      codeSystem: {
        url: system
      }
    },
    include: {
      codeSystem: true,
      designations: true
    }
  });

  if (!sourceConcept) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `Code '${code}' not found in system '${system}'`
      }]
    });
  }

  // Find the ConceptMap for NAMASTE to ICD11
  const conceptMap = await prisma.conceptMap.findFirst({
    where: {
      sourceUri: system,
      targetUri: target
    },
    include: {
      groups: {
        include: {
          elements: {
            where: { code },
            include: {
              targets: true
            }
          }
        }
      }
    }
  });

  if (!conceptMap || !conceptMap.groups.length) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No ConceptMap found for translating from '${system}' to '${target}'`
      }]
    });
  }

  // Collect all mappings
  const mappings = [];
  for (const group of conceptMap.groups) {
    for (const element of group.elements) {
      for (const target of element.targets) {
        mappings.push({
          targetSystem: conceptMap.targetUri,
          targetCode: target.code,
          targetDisplay: target.display,
          equivalence: target.equivalence,
          comment: target.comment
        });
      }
    }
  }

  if (mappings.length === 0) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No mappings found for code '${code}' from '${system}' to '${target}'`
      }]
    });
  }

  // Build response
  const response = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: true
      },
      {
        name: 'source',
        valueCoding: {
          system: sourceConcept.codeSystem.url,
          code: sourceConcept.code,
          display: sourceConcept.display
        }
      },
      ...mappings.map(mapping => ({
        name: 'match',
        part: [
          {
            name: 'equivalence',
            valueCode: mapping.equivalence
          },
          {
            name: 'concept',
            valueCoding: {
              system: mapping.targetSystem,
              code: mapping.targetCode,
              display: mapping.targetDisplay
            }
          },
          ...(mapping.comment ? [{
            name: 'comment',
            valueString: mapping.comment
          }] : [])
        ]
      }))
    ]
  };

  res.json(response);
}));

/**
 * POST /fhir/ConceptMap/$batch-translate - Handle batch translation
 * Supports multiple codes in a single request
 */
router.post('/$batch-translate', asyncHandler(async (req, res) => {
  // Try different ways to parse the parameters
  let codes = [], source, target;
  
  // Option 1: FHIR Parameters resource
  if (req.body?.parameter && Array.isArray(req.body.parameter)) {
    for (const param of req.body.parameter) {
      if (param.name === 'codes' && param.part && Array.isArray(param.part)) {
        codes = param.part.map(p => p.valueCode);
      } else if (param.name === 'source') {
        source = param.valueUri;
      } else if (param.name === 'target') {
        target = param.valueUri;
      }
    }
  } 
  // Option 2: Simple JSON object
  else if (req.body) {
    codes = req.body.codes || [];
    if (typeof codes === 'string') {
      codes = codes.split(',').map(c => c.trim());
    }
    source = req.body.source || 'https://ayush.gov.in/fhir/CodeSystem/namaste';
    target = req.body.target || 'http://id.who.int/icd/release/11/mms';
  }

  // Set a default code for API Explorer if none provided
  if (codes.length === 0) {
    codes = ['Y01.AC'];
  }

  console.log(`Processing batch translation request: codes=${codes.join(',')}, source=${source}, target=${target}`);

  // Find the ConceptMap
  const conceptMap = await prisma.conceptMap.findFirst({
    where: {
      sourceUri: source,
      targetUri: target
    },
    include: {
      groups: {
        include: {
          elements: {
            where: {
              code: { in: codes }
            },
            include: {
              targets: true
            }
          }
        }
      }
    }
  });

  if (!conceptMap || !conceptMap.groups.length) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No ConceptMap found for translating from '${source}' to '${target}'`
      }]
    });
  }

  // Process each code
  const results = [];
  
  for (const code of codes) {
    const mappings = [];
    
    // Find mappings for this code
    for (const group of conceptMap.groups) {
      for (const element of group.elements) {
        if (element.code === code) {
          for (const target of element.targets) {
            mappings.push({
              targetSystem: conceptMap.targetUri,
              targetCode: target.code,
              targetDisplay: target.display,
              equivalence: target.equivalence,
              comment: target.comment
            });
          }
        }
      }
    }
    
    // Add result for this code
    results.push({
      code,
      mappings,
      found: mappings.length > 0
    });
  }

  // Build response
  const response = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: results.some(r => r.found)
      },
      ...results.map(result => ({
        name: 'match',
        part: [
          {
            name: 'code',
            valueCode: result.code
          },
          {
            name: 'found',
            valueBoolean: result.found
          },
          ...(result.found ? 
            result.mappings.map(mapping => ({
              name: 'target',
              part: [
                {
                  name: 'equivalence',
                  valueCode: mapping.equivalence
                },
                {
                  name: 'concept',
                  valueCoding: {
                    system: mapping.targetSystem,
                    code: mapping.targetCode,
                    display: mapping.targetDisplay
                  }
                }
              ]
            })) : 
            [{
              name: 'message',
              valueString: `No mapping found for code ${result.code}`
            }]
          )
        ]
      }))
    ]
  };

  res.json(response);
}));

// Also add GET endpoint for $batch-translate
router.get('/$batch-translate', asyncHandler(async (req, res) => {
  const { codes: requestedCodes, source, target } = req.query;
  
  // If no codes provided, use a default for API Explorer
  const codes = requestedCodes || 'Y01.AC';
  
  // Parse codes
  const codesList = codes.split(',').map(c => c.trim());
  const sourceUri = source || 'https://ayush.gov.in/fhir/CodeSystem/namaste';
  const targetUri = target || 'http://id.who.int/icd/release/11/mms';

  console.log(`Processing GET batch translation: codes=${codesList.join(',')}, source=${sourceUri}, target=${targetUri}`);

  // Find the ConceptMap
  const conceptMap = await prisma.conceptMap.findFirst({
    where: {
      sourceUri,
      targetUri
    },
    include: {
      groups: {
        include: {
          elements: {
            where: {
              code: { in: codesList }
            },
            include: {
              targets: true
            }
          }
        }
      }
    }
  });

  if (!conceptMap || !conceptMap.groups.length) {
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `No ConceptMap found for translating from '${sourceUri}' to '${targetUri}'`
      }]
    });
  }

  // Process each code
  const results = [];
  
  for (const code of codesList) {
    const mappings = [];
    
    // Find mappings for this code
    for (const group of conceptMap.groups) {
      for (const element of group.elements) {
        if (element.code === code) {
          for (const target of element.targets) {
            mappings.push({
              targetSystem: conceptMap.targetUri,
              targetCode: target.code,
              targetDisplay: target.display,
              equivalence: target.equivalence,
              comment: target.comment
            });
          }
        }
      }
    }
    
    // Add result for this code
    results.push({
      code,
      mappings,
      found: mappings.length > 0
    });
  }

  // Build response
  const response = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: results.some(r => r.found)
      },
      ...results.map(result => ({
        name: 'match',
        part: [
          {
            name: 'code',
            valueCode: result.code
          },
          {
            name: 'found',
            valueBoolean: result.found
          },
          ...(result.found ? 
            result.mappings.map(mapping => ({
              name: 'target',
              part: [
                {
                  name: 'equivalence',
                  valueCode: mapping.equivalence
                },
                {
                  name: 'concept',
                  valueCoding: {
                    system: mapping.targetSystem,
                    code: mapping.targetCode,
                    display: mapping.targetDisplay
                  }
                }
              ]
            })) : 
            [{
              name: 'message',
              valueString: `No mapping found for code ${result.code}`
            }]
          )
        ]
      }))
    ]
  };

  res.json(response);
}));

module.exports = {
  translationRoutes: router
};
