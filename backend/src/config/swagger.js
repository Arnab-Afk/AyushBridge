const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AyushBridge FHIR R4 Terminology API',
      version: '1.0.0',
      description: `
        A FHIR R4-compliant terminology microservice for NAMASTE & ICD-11 TM2 integration.
        
        This API provides:
        - NAMASTE terminology lookup and search
        - ICD-11 TM2 and Biomedicine module integration
        - FHIR-compliant code translation and mapping
        - Dual-coded condition support for EMR systems
        - ABHA authentication integration
      `,
      contact: {
        name: 'AyushBridge Support',
        email: 'support@ayushbridge.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.FHIR_BASE_URL || 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.ayushbridge.in',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'ABHA OAuth 2.0 authentication endpoints'
      },
      {
        name: 'FHIR',
        description: 'FHIR R4 compliant terminology operations'
      },
      {
        name: 'Terminology',
        description: 'NAMASTE and ICD-11 terminology operations'
      },
      {
        name: 'Admin',
        description: 'Administrative operations (restricted)'
      },
      {
        name: 'Health',
        description: 'Health check and monitoring endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'ABHA JWT token for authentication'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for service-to-service authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Something went wrong'
            },
            code: {
              type: 'string',
              example: 'INTERNAL_SERVER_ERROR'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00Z'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'fail'
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'code'
                  },
                  message: {
                    type: 'string',
                    example: 'Code is required'
                  },
                  value: {
                    type: 'string',
                    example: ''
                  }
                }
              }
            }
          }
        },
        FHIROperationOutcome: {
          type: 'object',
          properties: {
            resourceType: {
              type: 'string',
              example: 'OperationOutcome'
            },
            issue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  severity: {
                    type: 'string',
                    enum: ['fatal', 'error', 'warning', 'information']
                  },
                  code: {
                    type: 'string',
                    example: 'invalid'
                  },
                  diagnostics: {
                    type: 'string',
                    example: 'The provided code is not valid'
                  }
                }
              }
            }
          }
        },
        NAMASTECode: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            code: {
              type: 'string',
              example: 'NAM001'
            },
            display: {
              type: 'string',
              example: 'Amavata'
            },
            system: {
              type: 'string',
              example: 'https://ayush.gov.in/fhir/CodeSystem/namaste'
            },
            traditional_system: {
              type: 'string',
              enum: ['ayurveda', 'siddha', 'unani'],
              example: 'ayurveda'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'deprecated'],
              example: 'active'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ICD11Code: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            code: {
              type: 'string',
              example: 'TM26.0'
            },
            display: {
              type: 'string',
              example: 'Disorders of vata dosha'
            },
            system: {
              type: 'string',
              example: 'http://id.who.int/icd/release/11/mms'
            },
            module: {
              type: 'string',
              enum: ['tm2', 'biomedicine'],
              example: 'tm2'
            },
            parent_code: {
              type: 'string',
              example: 'TM26'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              example: 'active'
            }
          }
        },
        ConceptMapping: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            source_system: {
              type: 'string',
              example: 'https://ayush.gov.in/fhir/CodeSystem/namaste'
            },
            source_code: {
              type: 'string',
              example: 'NAM001'
            },
            target_system: {
              type: 'string',
              example: 'http://id.who.int/icd/release/11/mms'
            },
            target_code: {
              type: 'string',
              example: 'TM26.0'
            },
            equivalence: {
              type: 'string',
              enum: ['relatedto', 'equivalent', 'equal', 'wider', 'subsumes', 'narrower', 'specializes', 'inexact', 'unmatched', 'disjoint'],
              example: 'equivalent'
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              example: 0.95
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
