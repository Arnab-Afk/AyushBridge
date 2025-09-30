const express = require('express');
const { asyncHandler, NotFoundError, ValidationError } = require('../middleware/errorHandler');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /fhir/CodeSystem/namaste/$lookup - Lookup specific NAMASTE codes
 * This route handles GET requests specifically for NAMASTE code lookup
 */
router.get('/namaste/$lookup', asyncHandler(async (req, res) => {
  const { code, system, version, displayLanguage } = req.query;

  if (!code) {
    throw new ValidationError('code parameter is required');
  }

  // Find the NAMASTE CodeSystem
  const codeSystem = await prisma.codeSystem.findFirst({
    where: { url: 'https://ayush.gov.in/fhir/CodeSystem/namaste' },
    include: {
      concepts: {
        where: { code },
        include: {
          designations: true,
          parent: true,
          children: true
        }
      }
    }
  });

  if (!codeSystem) {
    throw new NotFoundError('CodeSystem', 'NAMASTE');
  }

  // Find the concept
  const concept = codeSystem.concepts[0];

  if (!concept) {
    // Return not found
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `Code '${code}' not found in NAMASTE CodeSystem`
      }]
    });
  }

  // Filter designations by language if specified
  const designations = displayLanguage 
    ? concept.designations.filter(d => d.language === displayLanguage) 
    : concept.designations;

  // Build response parameters
  const parameters = [
    {
      name: 'result',
      valueBoolean: true
    },
    {
      name: 'name',
      valueString: 'NAMASTE'
    },
    {
      name: 'version',
      valueString: codeSystem.version || '1.0'
    },
    {
      name: 'display',
      valueString: concept.display
    },
    {
      name: 'code',
      valueCode: concept.code
    },
    {
      name: 'system',
      valueUri: codeSystem.url
    }
  ];

  // Add definition if available
  if (concept.definition) {
    parameters.push({
      name: 'definition',
      valueString: concept.definition
    });
  }

  // Add designations
  designations.forEach((designation) => {
    parameters.push({
      name: 'designation',
      part: [
        {
          name: 'language',
          valueCode: designation.language
        },
        {
          name: 'value',
          valueString: designation.value
        }
      ]
    });
  });

  // Add hierarchical relationships
  if (concept.parent) {
    parameters.push({
      name: 'property',
      part: [
        {
          name: 'code',
          valueCode: 'parent'
        },
        {
          name: 'value',
          valueCode: concept.parent.code
        }
      ]
    });
  }

  if (concept.children && concept.children.length > 0) {
    concept.children.forEach(child => {
      parameters.push({
        name: 'property',
        part: [
          {
            name: 'code',
            valueCode: 'child'
          },
          {
            name: 'value',
            valueCode: child.code
          }
        ]
      });
    });
  }

  res.json({
    resourceType: 'Parameters',
    parameter: parameters
  });
}));

/**
 * GET /fhir/CodeSystem/icd11/$lookup - Lookup specific ICD-11 codes
 * This route handles GET requests specifically for ICD-11 code lookup
 */
router.get('/icd11/$lookup', asyncHandler(async (req, res) => {
  const { code, system, version, displayLanguage } = req.query;

  if (!code) {
    throw new ValidationError('code parameter is required');
  }

  // Find the ICD-11 CodeSystem
  const codeSystem = await prisma.codeSystem.findFirst({
    where: { url: 'http://id.who.int/icd/release/11/mms' },
    include: {
      concepts: {
        where: { code },
        include: {
          designations: true,
          parent: true,
          children: true
        }
      }
    }
  });

  if (!codeSystem) {
    throw new NotFoundError('CodeSystem', 'ICD-11');
  }

  // Find the concept
  const concept = codeSystem.concepts[0];

  if (!concept) {
    // Return not found
    return res.json({
      resourceType: 'Parameters',
      parameter: [{
        name: 'result',
        valueBoolean: false
      }, {
        name: 'message',
        valueString: `Code '${code}' not found in ICD-11 CodeSystem`
      }]
    });
  }

  // Filter designations by language if specified
  const designations = displayLanguage 
    ? concept.designations.filter(d => d.language === displayLanguage) 
    : concept.designations;

  // Build response parameters
  const parameters = [
    {
      name: 'result',
      valueBoolean: true
    },
    {
      name: 'name',
      valueString: 'ICD-11'
    },
    {
      name: 'version',
      valueString: codeSystem.version || '2023-01'
    },
    {
      name: 'display',
      valueString: concept.display
    },
    {
      name: 'code',
      valueCode: concept.code
    },
    {
      name: 'system',
      valueUri: codeSystem.url
    }
  ];

  // Add definition if available
  if (concept.definition) {
    parameters.push({
      name: 'definition',
      valueString: concept.definition
    });
  }

  // Add designations
  designations.forEach((designation) => {
    parameters.push({
      name: 'designation',
      part: [
        {
          name: 'language',
          valueCode: designation.language
        },
        {
          name: 'value',
          valueString: designation.value
        }
      ]
    });
  });

  // Add hierarchical relationships
  if (concept.parent) {
    parameters.push({
      name: 'property',
      part: [
        {
          name: 'code',
          valueCode: 'parent'
        },
        {
          name: 'value',
          valueCode: concept.parent.code
        }
      ]
    });
  }

  if (concept.children && concept.children.length > 0) {
    concept.children.forEach(child => {
      parameters.push({
        name: 'property',
        part: [
          {
            name: 'code',
            valueCode: 'child'
          },
          {
            name: 'value',
            valueCode: child.code
          }
        ]
      });
    });
  }

  res.json({
    resourceType: 'Parameters',
    parameter: parameters
  });
}));

/**
 * Handle ValueSet/$expand for NAMASTE and ICD-11
 */

/**
 * GET /fhir/ValueSet/namaste/$expand - Search and auto-complete for NAMASTE terms
 */
router.get('/namaste/$expand', asyncHandler(async (req, res) => {
  const { filter, count = 20, system, includeDefinition = false } = req.query;
  
  if (!filter || filter.length < 2) {
    throw new ValidationError('filter parameter must be at least 2 characters');
  }
  
  const results = await searchTerms('namaste', filter, count, includeDefinition === 'true', system);
  
  res.json(formatValueSetExpansion('NAMASTE', results, filter));
}));

/**
 * GET /fhir/ValueSet/icd11/$expand - Search and auto-complete for ICD-11 terms
 */
router.get('/icd11/$expand', asyncHandler(async (req, res) => {
  const { filter, count = 20, includeDefinition = false } = req.query;
  
  if (!filter || filter.length < 2) {
    throw new ValidationError('filter parameter must be at least 2 characters');
  }
  
  const results = await searchTerms('icd11', filter, count, includeDefinition === 'true');
  
  res.json(formatValueSetExpansion('ICD-11', results, filter));
}));

// Helper function to search terms
async function searchTerms(terminology, searchText, limit = 20, includeDefinition = false, system = null) {
  const systemMappings = {
    'namaste': 'https://ayush.gov.in/fhir/CodeSystem/namaste',
    'icd11': 'http://id.who.int/icd/release/11/mms'
  };

  const systemUrl = systemMappings[terminology.toLowerCase()];
  if (!systemUrl) {
    throw new ValidationError(`Unknown terminology: ${terminology}`);
  }

  // Build the where clause for concept filtering
  let conceptWhere = {
    OR: [
      { code: { contains: searchText, mode: 'insensitive' } },
      { display: { contains: searchText, mode: 'insensitive' } },
      { 
        designations: { 
          some: { 
            value: { contains: searchText, mode: 'insensitive' } 
          } 
        } 
      }
    ]
  };

  // Find matching concepts
  const codeSystem = await prisma.codeSystem.findUnique({
    where: { url: systemUrl },
    include: {
      concepts: {
        where: conceptWhere,
        include: {
          designations: true
        },
        take: parseInt(limit),
        orderBy: [
          { display: 'asc' },
          { code: 'asc' }
        ]
      }
    }
  });

  if (!codeSystem || !codeSystem.concepts || codeSystem.concepts.length === 0) {
    return [];
  }

  return codeSystem.concepts.map(concept => {
    // Create the base object
    const result = {
      system: codeSystem.url,
      code: concept.code,
      display: concept.display,
      designations: concept.designations || []
    };
    
    // Add definition if requested and available
    if (includeDefinition && concept.definition) {
      result.definition = concept.definition;
    }
    
    // Add properties if requested and available
    // Safely handle the properties field which is a JSON field
    if (includeDefinition && concept.properties) {
      try {
        // If properties is already an object, use it directly
        result.properties = concept.properties;
      } catch (err) {
        console.warn(`Error processing properties for concept ${concept.code}:`, err);
        // In case of error, add empty properties object
        result.properties = {};
      }
    }
    
    return result;
  });
}

// Helper function to format ValueSet expansion results
function formatValueSetExpansion(name, results, filter) {
  return {
    resourceType: 'ValueSet',
    id: `${name.toLowerCase()}-search-results`,
    url: `https://ayushbridge.in/fhir/ValueSet/${name.toLowerCase()}-search-results`,
    version: '1.0.0',
    name: `${name}SearchResults`,
    title: `${name} Search Results`,
    status: 'active',
    date: new Date().toISOString(),
    publisher: 'AyushBridge',
    description: `Search results for ${filter} in ${name} terminology`,
    expansion: {
      timestamp: new Date().toISOString(),
      total: results.length,
      offset: 0,
      contains: results.map(result => {
        const entry = {
          system: result.system,
          code: result.code,
          display: result.display
        };
        
        // Add definition if available
        if (result.definition) {
          entry.definition = result.definition;
        }
        
        // Add designations if available
        if (result.designations && result.designations.length > 0) {
          entry.designation = result.designations.map(d => ({
            language: d.language,
            value: d.value
          }));
        }
        
        // Add properties as property array in FHIR format if available
        if (result.properties && typeof result.properties === 'object' && Object.keys(result.properties).length > 0) {
          entry.property = Object.entries(result.properties).map(([key, value]) => ({
            code: key,
            valueString: typeof value === 'string' ? value : JSON.stringify(value)
          }));
        }
        
        return entry;
      })
    }
  };
}

module.exports = {
  namasteRoutes: router
};
