#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates database with initial sample data for development
 */

const { sequelize } = require('../src/config/database');
const { NAMASTECode, ICD11Code, ConceptMapping } = require('../src/models');
const logger = require('../src/utils/logger');

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');
    
    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established');
    
    // Sample NAMASTE codes
    const namasteCodes = [
      {
        code: 'NAM001',
        display: 'Amavata',
        definition: 'A condition characterized by ama (toxins) affecting the joints, similar to rheumatoid arthritis',
        traditional_system: 'ayurveda',
        status: 'active'
      },
      {
        code: 'NAM002',
        display: 'Sandhivata',
        definition: 'Degenerative joint disease caused by vata dosha imbalance',
        traditional_system: 'ayurveda',
        status: 'active'
      },
      {
        code: 'NAM003',
        display: 'Shirashoola',
        definition: 'Headache or head pain in Ayurvedic terminology',
        traditional_system: 'ayurveda',
        status: 'active'
      },
      {
        code: 'SID001',
        display: 'Keel Vayu',
        definition: 'Joint disorders in Siddha medicine',
        traditional_system: 'siddha',
        status: 'active'
      },
      {
        code: 'UNA001',
        display: 'Waja ul Mafasil',
        definition: 'Joint pain in Unani medicine',
        traditional_system: 'unani',
        status: 'active'
      }
    ];
    
    // Sample ICD-11 codes
    const icd11Codes = [
      {
        code: 'TM26.0',
        display: 'Disorders of vata dosha',
        definition: 'Traditional Medicine conditions related to vata dosha imbalance',
        module: 'tm2',
        status: 'active'
      },
      {
        code: 'TM26.1',
        display: 'Disorders of pitta dosha',
        definition: 'Traditional Medicine conditions related to pitta dosha imbalance',
        module: 'tm2',
        status: 'active'
      },
      {
        code: 'TM26.2',
        display: 'Disorders of kapha dosha',
        definition: 'Traditional Medicine conditions related to kapha dosha imbalance',
        module: 'tm2',
        status: 'active'
      },
      {
        code: 'FA20.00',
        display: 'Rheumatoid arthritis, unspecified',
        definition: 'Chronic inflammatory arthritis of unknown etiology',
        module: 'biomedicine',
        status: 'active'
      },
      {
        code: 'FA20.10',
        display: 'Osteoarthritis, unspecified',
        definition: 'Degenerative joint disease',
        module: 'biomedicine',
        status: 'active'
      },
      {
        code: '8A80.00',
        display: 'Headache, unspecified',
        definition: 'Pain in the head or neck region',
        module: 'biomedicine',
        status: 'active'
      }
    ];
    
    // Sample concept mappings
    const conceptMappings = [
      {
        source_code: 'NAM001',
        target_code: 'TM26.0',
        target_module: 'tm2',
        source_traditional_system: 'ayurveda',
        equivalence: 'equivalent',
        confidence: 0.95,
        comment: 'Direct mapping validated by Ayurveda experts',
        validated: true,
        mapping_method: 'expert-review'
      },
      {
        source_code: 'NAM001',
        target_code: 'FA20.00',
        target_module: 'biomedicine',
        source_traditional_system: 'ayurveda',
        equivalence: 'wider',
        confidence: 0.85,
        comment: 'Amavata encompasses broader conditions than just rheumatoid arthritis',
        validated: true,
        mapping_method: 'expert-review'
      },
      {
        source_code: 'NAM002',
        target_code: 'TM26.0',
        target_module: 'tm2',
        source_traditional_system: 'ayurveda',
        equivalence: 'equivalent',
        confidence: 0.90,
        comment: 'Sandhivata is a vata dosha disorder',
        validated: true,
        mapping_method: 'expert-review'
      },
      {
        source_code: 'NAM002',
        target_code: 'FA20.10',
        target_module: 'biomedicine',
        source_traditional_system: 'ayurveda',
        equivalence: 'equivalent',
        confidence: 0.88,
        comment: 'Sandhivata closely corresponds to osteoarthritis',
        validated: true,
        mapping_method: 'expert-review'
      },
      {
        source_code: 'NAM003',
        target_code: '8A80.00',
        target_module: 'biomedicine',
        source_traditional_system: 'ayurveda',
        equivalence: 'equivalent',
        confidence: 0.92,
        comment: 'Direct translation of headache',
        validated: true,
        mapping_method: 'expert-review'
      }
    ];
    
    // Insert data
    logger.info('Inserting NAMASTE codes...');
    for (const code of namasteCodes) {
      await NAMASTECode.findOrCreate({
        where: { code: code.code },
        defaults: code
      });
    }
    logger.info(`✓ Inserted ${namasteCodes.length} NAMASTE codes`);
    
    logger.info('Inserting ICD-11 codes...');
    for (const code of icd11Codes) {
      await ICD11Code.findOrCreate({
        where: { code: code.code },
        defaults: code
      });
    }
    logger.info(`✓ Inserted ${icd11Codes.length} ICD-11 codes`);
    
    logger.info('Inserting concept mappings...');
    for (const mapping of conceptMappings) {
      await ConceptMapping.findOrCreate({
        where: { 
          source_code: mapping.source_code,
          target_code: mapping.target_code
        },
        defaults: mapping
      });
    }
    logger.info(`✓ Inserted ${conceptMappings.length} concept mappings`);
    
    logger.info('✅ Database seeding completed successfully');
    
    // Display summary
    const counts = await getSummary();
    logger.info('\n📊 Database Summary:');
    logger.info(`   NAMASTE Codes: ${counts.namaste}`);
    logger.info(`   ICD-11 Codes: ${counts.icd11}`);
    logger.info(`   Concept Mappings: ${counts.mappings}`);
    
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function getSummary() {
  const [namaste, icd11, mappings] = await Promise.all([
    NAMASTECode.count(),
    ICD11Code.count(),
    ConceptMapping.count()
  ]);
  
  return { namaste, icd11, mappings };
}

// Command line options
if (process.argv.includes('--help')) {
  console.log(`
Database Seeding Script

Usage: node scripts/seed.js [options]

Options:
  --help     Show this help message

This script will insert sample data for development and testing.
It will not overwrite existing data (uses findOrCreate).

Examples:
  node scripts/seed.js                      # Insert sample data
`);
  process.exit(0);
}

seedDatabase();
