const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const NAMASTECode = require('../models/NamasteCode');
const ICD11Code = require('../models/ICD11Code');
const ConceptMapping = require('../models/ConceptMapping');

/**
 * @swagger
 * tags:
 *   name: FHIR
 *   description: FHIR R4 compliant terminology operations
 */

/**
 * @swagger
 * /fhir/metadata:
 *   get:
 *     summary: Get FHIR CapabilityStatement
 *     tags: [FHIR]
 *     responses:
 *       200:
 *         description: FHIR CapabilityStatement
 *         content:
 *           application/fhir+json:
 *             schema:
 *               type: object
 */
router.get('/metadata', asyncHandler(async (req, res) => {
  const capabilityStatement = {
    resourceType: 'CapabilityStatement',
    id: 'ayushbridge-terminology-server',
    meta: {
      versionId: '1',
      lastUpdated: new Date().toISOString()
    },
    url: 'https://api.ayushbridge.in/fhir/metadata',
    version: '1.0.0',
    name: 'AyushBridgeTerminologyServer',
    title: 'AyushBridge FHIR R4 Terminology Server',
    status: 'active',
    experimental: false,
    date: new Date().toISOString(),
    publisher: 'Ministry of AYUSH, Government of India',
    description: 'FHIR R4 terminology server for NAMASTE and ICD-11 TM2 integration',
    kind: 'instance',
    software: {
      name: 'AyushBridge',
      version: '1.0.0',
      releaseDate: new Date().toISOString()
    },
    implementation: {
      description: 'AyushBridge FHIR Terminology Microservice',
      url: process.env.FHIR_BASE_URL || 'http://localhost:3000/fhir'
    },
    fhirVersion: '4.0.1',
    format: ['application/fhir+json', 'application/json'],
    rest: [
      {
        mode: 'server',
        security: {
          cors: true,
          service: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
                  code: 'OAuth',
                  display: 'OAuth2 using ABHA'
                }
              ]
            }
          ]
        },
        resource: [
          {
            type: 'CodeSystem',
            profile: 'http://hl7.org/fhir/StructureDefinition/CodeSystem',
            interaction: [
              { code: 'read' },
              { code: 'search-type' }
            ],
            operation: [
              {
                name: 'lookup',
                definition: 'http://hl7.org/fhir/OperationDefinition/CodeSystem-lookup'
              },
              {
                name: 'validate-code',
                definition: 'http://hl7.org/fhir/OperationDefinition/CodeSystem-validate-code'
              }
            ]
          },
          {
            type: 'ConceptMap',
            profile: 'http://hl7.org/fhir/StructureDefinition/ConceptMap',
            interaction: [
              { code: 'read' },
              { code: 'search-type' }
            ],
            operation: [
              {
                name: 'translate',
                definition: 'http://hl7.org/fhir/OperationDefinition/ConceptMap-translate'
              }
            ]
          },
          {
            type: 'ValueSet',
            profile: 'http://hl7.org/fhir/StructureDefinition/ValueSet',
            interaction: [
              { code: 'read' },
              { code: 'search-type' }
            ],
            operation: [
              {
                name: 'expand',
                definition: 'http://hl7.org/fhir/OperationDefinition/ValueSet-expand'
              }
            ]
          },
          {
            type: 'Bundle',
            profile: 'http://hl7.org/fhir/StructureDefinition/Bundle',
            interaction: [
              { code: 'create' }
            ]
          }
        ]
      }
    ]
  };
  
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(capabilityStatement);
}));

/**
 * @swagger
 * /fhir/CodeSystem/namaste/$lookup:
 *   get:
 *     summary: FHIR CodeSystem $lookup operation for NAMASTE
 *     tags: [FHIR]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: NAMASTE code to lookup
 *       - in: query
 *         name: system
 *         schema:
 *           type: string
 *         description: Code system URI
 *       - in: query
 *         name: displayLanguage
 *         schema:
 *           type: string
 *           default: en
 *         description: Language for display text
 *     responses:
 *       200:
 *         description: FHIR Parameters resource with lookup results
 *         content:
 *           application/fhir+json:
 *             schema:
 *               type: object
 */
router.get('/CodeSystem/namaste/$lookup', asyncHandler(async (req, res) => {
  const { code, system, displayLanguage = 'en' } = req.query;
  
  if (!code) {
    return res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'required',
          diagnostics: 'Parameter "code" is required'
        }
      ]
    });
  }
  
  const namasteCode = await NAMASTECode.findOne({
    where: { code, status: 'active' }
  });
  
  if (!namasteCode) {
    return res.status(404).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'not-found',
          diagnostics: `Code "${code}" not found in NAMASTE CodeSystem`
        }
      ]
    });
  }
  
  // Find related ICD-11 mappings
  const mappings = await ConceptMapping.translateCode(code);
  
  const parameters = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'name',
        valueString: 'NAMASTE Terminology'
      },
      {
        name: 'version',
        valueString: namasteCode.version
      },
      {
        name: 'display',
        valueString: namasteCode.display
      },
      {
        name: 'system',
        valueString: namasteCode.system
      },
      {
        name: 'definition',
        valueString: namasteCode.definition
      },
      {
        name: 'property',
        part: [
          {
            name: 'code',
            valueCode: 'traditional-system'
          },
          {
            name: 'value',
            valueString: namasteCode.traditional_system
          }
        ]
      }
    ]
  };
  
  // Add ICD-11 mappings as properties
  mappings.forEach(mapping => {
    parameters.parameter.push({
      name: 'property',
      part: [
        {
          name: 'code',
          valueCode: mapping.target_module === 'tm2' ? 'icd11-tm2' : 'icd11-bio'
        },
        {
          name: 'value',
          valueString: mapping.target_code
        },
        {
          name: 'description',
          valueString: mapping.target_display
        }
      ]
    });
  });
  
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(parameters);
}));

/**
 * @swagger
 * /fhir/ConceptMap/namaste-to-icd11/$translate:
 *   post:
 *     summary: FHIR ConceptMap $translate operation
 *     tags: [FHIR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/fhir+json:
 *           schema:
 *             type: object
 *             properties:
 *               resourceType:
 *                 type: string
 *                 example: Parameters
 *               parameter:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: FHIR Parameters resource with translation results
 *         content:
 *           application/fhir+json:
 *             schema:
 *               type: object
 */
router.post('/ConceptMap/namaste-to-icd11/$translate', asyncHandler(async (req, res) => {
  const { resourceType, parameter } = req.body;
  
  if (resourceType !== 'Parameters' || !parameter) {
    return res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Request must be a FHIR Parameters resource'
        }
      ]
    });
  }
  
  // Extract parameters
  const codeParam = parameter.find(p => p.name === 'code');
  const systemParam = parameter.find(p => p.name === 'system');
  const targetParam = parameter.find(p => p.name === 'target');
  
  if (!codeParam || !codeParam.valueCode) {
    return res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'required',
          diagnostics: 'Parameter "code" with valueCode is required'
        }
      ]
    });
  }
  
  const sourceCode = codeParam.valueCode;
  const sourceSystem = systemParam?.valueUri;
  const targetSystem = targetParam?.valueUri;
  
  const mappings = await ConceptMapping.translateCode(sourceCode, sourceSystem, targetSystem);
  
  const result = {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: mappings.length > 0
      }
    ]
  };
  
  if (mappings.length > 0) {
    mappings.forEach(mapping => {
      result.parameter.push({
        name: 'match',
        part: [
          {
            name: 'equivalence',
            valueCode: mapping.equivalence
          },
          {
            name: 'concept',
            valueCoding: {
              system: mapping.target_system,
              code: mapping.target_code,
              display: mapping.target_display
            }
          },
          {
            name: 'source',
            valueString: 'https://api.ayushbridge.in/fhir/ConceptMap/namaste-to-icd11'
          }
        ]
      });
    });
  } else {
    result.parameter.push({
      name: 'message',
      valueString: `No translation found for code "${sourceCode}"`
    });
  }
  
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(result);
}));

/**
 * @swagger
 * /fhir/ValueSet/namaste/$expand:
 *   get:
 *     summary: FHIR ValueSet $expand operation for NAMASTE
 *     tags: [FHIR]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter text for expansion
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of codes to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: FHIR ValueSet with expansion
 *         content:
 *           application/fhir+json:
 *             schema:
 *               type: object
 */
router.get('/ValueSet/namaste/$expand', asyncHandler(async (req, res) => {
  const { filter, count = 20, offset = 0 } = req.query;
  
  let results;
  if (filter) {
    results = await NAMASTECode.searchByText(filter, null, parseInt(count), parseInt(offset));
  } else {
    results = await NAMASTECode.findAndCountAll({
      where: { status: 'active' },
      limit: parseInt(count),
      offset: parseInt(offset),
      order: [['display', 'ASC']]
    });
  }
  
  const valueSet = {
    resourceType: 'ValueSet',
    id: 'namaste-terminology',
    meta: {
      versionId: '1',
      lastUpdated: new Date().toISOString()
    },
    url: 'https://ayush.gov.in/fhir/ValueSet/namaste',
    version: '1.0.0',
    name: 'NAMASTETerminology',
    title: 'NAMASTE Terminology Value Set',
    status: 'active',
    experimental: false,
    date: new Date().toISOString(),
    publisher: 'Ministry of AYUSH, Government of India',
    description: 'Complete NAMASTE terminology for Ayurveda, Siddha, and Unani systems',
    expansion: {
      identifier: `urn:uuid:${require('crypto').randomUUID()}`,
      timestamp: new Date().toISOString(),
      total: results.count,
      offset: parseInt(offset),
      parameter: [
        {
          name: 'count',
          valueInteger: parseInt(count)
        },
        {
          name: 'offset',
          valueInteger: parseInt(offset)
        }
      ],
      contains: results.rows.map(code => ({
        system: code.system,
        code: code.code,
        display: code.display
      }))
    }
  };
  
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(valueSet);
}));

/**
 * @swagger
 * /fhir/Bundle:
 *   post:
 *     summary: Submit FHIR Bundle with dual-coded conditions
 *     tags: [FHIR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/fhir+json:
 *           schema:
 *             type: object
 *             properties:
 *               resourceType:
 *                 type: string
 *                 example: Bundle
 *               type:
 *                 type: string
 *                 example: transaction
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Bundle processed successfully
 *         content:
 *           application/fhir+json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid FHIR Bundle
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/Bundle', asyncHandler(async (req, res) => {
  const bundle = req.body;
  
  // Basic validation
  if (!bundle || bundle.resourceType !== 'Bundle') {
    return res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'invalid',
          diagnostics: 'Request must be a valid FHIR Bundle'
        }
      ]
    });
  }
  
  if (!bundle.entry || !Array.isArray(bundle.entry)) {
    return res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity: 'error',
          code: 'required',
          diagnostics: 'Bundle must contain entries'
        }
      ]
    });
  }
  
  // Process bundle entries
  const processedEntries = [];
  let dualCodedConditions = 0;
  
  for (const entry of bundle.entry) {
    if (entry.resource?.resourceType === 'Condition') {
      const condition = entry.resource;
      
      // Check for dual coding (NAMASTE + ICD-11)
      if (condition.code?.coding) {
        const namasteCode = condition.code.coding.find(
          c => c.system === 'https://ayush.gov.in/fhir/CodeSystem/namaste'
        );
        const icd11Code = condition.code.coding.find(
          c => c.system === 'http://id.who.int/icd/release/11/mms'
        );
        
        if (namasteCode && icd11Code) {
          dualCodedConditions++;
        }
      }
    }
    
    processedEntries.push({
      fullUrl: entry.fullUrl,
      resource: entry.resource,
      response: {
        status: '201 Created',
        location: `${entry.resource.resourceType}/${require('crypto').randomUUID()}`,
        lastModified: new Date().toISOString()
      }
    });
  }
  
  // Create response bundle
  const responseBundle = {
    resourceType: 'Bundle',
    id: require('crypto').randomUUID(),
    meta: {
      lastUpdated: new Date().toISOString()
    },
    type: 'transaction-response',
    entry: processedEntries
  };
  
  res.status(201);
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json(responseBundle);
}));

module.exports = router;
