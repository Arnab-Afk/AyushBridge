const fs = require('fs-extra');
const path = require('path');
const Joi = require('joi');
const chalk = require('chalk');

class FileUtils {
  static async readJsonFile(filePath) {
    try {
      if (!await fs.pathExists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = await fs.readJson(filePath);
      return content;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw new Error(`Failed to read JSON file: ${error.message}`);
    }
  }

  static async writeJsonFile(filePath, data) {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeJson(filePath, data, { spaces: 2 });
      console.log(chalk.green(`✓ File written: ${filePath}`));
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${error.message}`);
    }
  }

  static async validateFhirResource(resource, resourceType) {
    const schemas = {
      CodeSystem: Joi.object({
        resourceType: Joi.string().valid('CodeSystem').required(),
        id: Joi.string().optional(),
        url: Joi.string().uri().required(),
        version: Joi.string().optional(),
        name: Joi.string().required(),
        title: Joi.string().optional(),
        status: Joi.string().valid('draft', 'active', 'retired', 'unknown').required(),
        experimental: Joi.boolean().optional(),
        date: Joi.string().isoDate().optional(),
        publisher: Joi.string().optional(),
        description: Joi.string().optional(),
        content: Joi.string().valid('not-present', 'example', 'fragment', 'complete', 'supplement').optional(),
        count: Joi.number().integer().min(0).optional(),
        concept: Joi.array().items(
          Joi.object({
            code: Joi.string().required(),
            display: Joi.string().optional(),
            definition: Joi.string().optional()
          })
        ).optional()
      }).unknown(),

      ConceptMap: Joi.object({
        resourceType: Joi.string().valid('ConceptMap').required(),
        id: Joi.string().optional(),
        url: Joi.string().uri().required(),
        version: Joi.string().optional(),
        name: Joi.string().required(),
        title: Joi.string().optional(),
        status: Joi.string().valid('draft', 'active', 'retired', 'unknown').required(),
        experimental: Joi.boolean().optional(),
        date: Joi.string().isoDate().optional(),
        publisher: Joi.string().optional(),
        description: Joi.string().optional(),
        sourceCanonical: Joi.string().uri().optional(),
        targetCanonical: Joi.string().uri().optional(),
        group: Joi.array().items(
          Joi.object({
            source: Joi.string().uri().optional(),
            target: Joi.string().uri().optional(),
            element: Joi.array().items(
              Joi.object({
                code: Joi.string().required(),
                target: Joi.array().items(
                  Joi.object({
                    code: Joi.string().required(),
                    equivalence: Joi.string().valid('relatedto', 'equivalent', 'equal', 'wider', 'subsumes', 'narrower', 'specializes', 'inexact', 'unmatched', 'disjoint').optional()
                  })
                ).optional()
              })
            ).optional()
          })
        ).optional()
      }).unknown(),

      ValueSet: Joi.object({
        resourceType: Joi.string().valid('ValueSet').required(),
        id: Joi.string().optional(),
        url: Joi.string().uri().required(),
        version: Joi.string().optional(),
        name: Joi.string().required(),
        title: Joi.string().optional(),
        status: Joi.string().valid('draft', 'active', 'retired', 'unknown').required(),
        experimental: Joi.boolean().optional(),
        date: Joi.string().isoDate().optional(),
        publisher: Joi.string().optional(),
        description: Joi.string().optional(),
        compose: Joi.object({
          include: Joi.array().items(
            Joi.object({
              system: Joi.string().uri().optional(),
              concept: Joi.array().items(
                Joi.object({
                  code: Joi.string().required(),
                  display: Joi.string().optional()
                })
              ).optional()
            })
          ).optional()
        }).optional()
      }).unknown(),

      Patient: Joi.object({
        resourceType: Joi.string().valid('Patient').required(),
        id: Joi.string().optional(),
        active: Joi.boolean().optional(),
        name: Joi.array().items(
          Joi.object({
            family: Joi.string().optional(),
            given: Joi.array().items(Joi.string()).optional(),
            use: Joi.string().valid('usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden').optional()
          })
        ).optional(),
        gender: Joi.string().valid('male', 'female', 'other', 'unknown').optional(),
        birthDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
        address: Joi.array().items(
          Joi.object({
            line: Joi.array().items(Joi.string()).optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            postalCode: Joi.string().optional(),
            country: Joi.string().optional()
          })
        ).optional()
      }).unknown(),

      Condition: Joi.object({
        resourceType: Joi.string().valid('Condition').required(),
        id: Joi.string().optional(),
        clinicalStatus: Joi.object({
          coding: Joi.array().items(
            Joi.object({
              system: Joi.string().uri().optional(),
              code: Joi.string().required(),
              display: Joi.string().optional()
            })
          ).required()
        }).optional(),
        verificationStatus: Joi.object({
          coding: Joi.array().items(
            Joi.object({
              system: Joi.string().uri().optional(),
              code: Joi.string().required(),
              display: Joi.string().optional()
            })
          ).required()
        }).optional(),
        code: Joi.object({
          coding: Joi.array().items(
            Joi.object({
              system: Joi.string().uri().optional(),
              code: Joi.string().required(),
              display: Joi.string().optional()
            })
          ).optional(),
          text: Joi.string().optional()
        }).required(),
        subject: Joi.object({
          reference: Joi.string().required()
        }).required()
      }).unknown()
    };

    const schema = schemas[resourceType];
    if (!schema) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    const { error, value } = schema.validate(resource);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    }

    return value;
  }

  static async createExampleFiles(outputDir = './examples') {
    await fs.ensureDir(outputDir);

    const examples = {
      'codesystem-example.json': {
        resourceType: 'CodeSystem',
        url: 'http://example.org/fhir/CodeSystem/example',
        version: '1.0.0',
        name: 'ExampleCodeSystem',
        title: 'Example Code System',
        status: 'active',
        experimental: false,
        date: new Date().toISOString().split('T')[0],
        publisher: 'Example Organization',
        description: 'An example code system for demonstration purposes',
        content: 'complete',
        count: 3,
        concept: [
          {
            code: 'example-1',
            display: 'Example Concept 1',
            definition: 'First example concept'
          },
          {
            code: 'example-2',
            display: 'Example Concept 2',
            definition: 'Second example concept'
          },
          {
            code: 'example-3',
            display: 'Example Concept 3',
            definition: 'Third example concept'
          }
        ]
      },

      'conceptmap-example.json': {
        resourceType: 'ConceptMap',
        url: 'http://example.org/fhir/ConceptMap/example',
        version: '1.0.0',
        name: 'ExampleConceptMap',
        title: 'Example Concept Map',
        status: 'active',
        experimental: false,
        date: new Date().toISOString().split('T')[0],
        publisher: 'Example Organization',
        description: 'An example concept map for demonstration purposes',
        sourceCanonical: 'http://example.org/fhir/CodeSystem/source',
        targetCanonical: 'http://example.org/fhir/CodeSystem/target',
        group: [
          {
            source: 'http://example.org/fhir/CodeSystem/source',
            target: 'http://example.org/fhir/CodeSystem/target',
            element: [
              {
                code: 'source-1',
                target: [
                  {
                    code: 'target-1',
                    equivalence: 'equivalent'
                  }
                ]
              }
            ]
          }
        ]
      },

      'patient-example.json': {
        resourceType: 'Patient',
        active: true,
        name: [
          {
            family: 'Doe',
            given: ['John'],
            use: 'official'
          }
        ],
        gender: 'male',
        birthDate: '1990-01-01',
        address: [
          {
            line: ['123 Main St'],
            city: 'Anytown',
            state: 'State',
            postalCode: '12345',
            country: 'Country'
          }
        ]
      },

      'condition-example.json': {
        resourceType: 'Condition',
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'Active'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
              display: 'Confirmed'
            }
          ]
        },
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386661006',
              display: 'Fever'
            }
          ],
          text: 'Fever'
        },
        subject: {
          reference: 'Patient/example-patient-id'
        }
      }
    };

    for (const [filename, content] of Object.entries(examples)) {
      const filePath = path.join(outputDir, filename);
      await this.writeJsonFile(filePath, content);
    }

    console.log(chalk.green(`✓ Example files created in ${outputDir}`));
    console.log(chalk.blue('Available examples:'));
    Object.keys(examples).forEach(filename => {
      console.log(`  - ${filename}`);
    });
  }

  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async getFileStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: this.formatBytes(stats.size),
        modified: stats.mtime.toISOString(),
        created: stats.ctime.toISOString()
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = FileUtils;
