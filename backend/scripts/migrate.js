#!/usr/bin/env node

/**
 * Database Migration Script
 * Creates all necessary tables and indexes for AyushBridge
 */

const { sequelize } = require('../src/config/database');
const logger = require('../src/utils/logger');

// Import models to register them
require('../src/models');

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');
    
    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Sync all models (create tables)
    await sequelize.sync({ 
      force: process.argv.includes('--force'),
      alter: process.argv.includes('--alter')
    });
    
    logger.info('✅ Database migrations completed successfully');
    
    // Create additional indexes that Sequelize might not handle
    await createAdditionalIndexes();
    
    logger.info('✅ Additional indexes created successfully');
    
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function createAdditionalIndexes() {
  const queries = [
    // NAMASTE codes full-text search index
    `CREATE INDEX IF NOT EXISTS namaste_codes_search_gin_idx 
     ON namaste_codes USING gin(to_tsvector('english', display || ' ' || COALESCE(definition, '')))`,
    
    // ICD11 codes full-text search index
    `CREATE INDEX IF NOT EXISTS icd11_codes_search_gin_idx 
     ON icd11_codes USING gin(to_tsvector('english', display || ' ' || COALESCE(definition, '')))`,
    
    // Composite indexes for concept mappings
    `CREATE INDEX IF NOT EXISTS concept_mappings_source_target_idx 
     ON concept_mappings(source_system, source_code, target_system, target_code)`,
    
    // Performance indexes
    `CREATE INDEX IF NOT EXISTS namaste_codes_status_system_idx 
     ON namaste_codes(status, traditional_system)`,
     
    `CREATE INDEX IF NOT EXISTS icd11_codes_status_module_idx 
     ON icd11_codes(status, module)`,
     
    // Hierarchy index for ICD11
    `CREATE INDEX IF NOT EXISTS icd11_codes_hierarchy_idx 
     ON icd11_codes(parent_code, code) WHERE parent_code IS NOT NULL`
  ];
  
  for (const query of queries) {
    try {
      await sequelize.query(query);
      logger.info(`✓ Executed: ${query.split('\n')[0]}...`);
    } catch (error) {
      logger.warn(`⚠ Failed to create index: ${error.message}`);
    }
  }
}

// Command line options
if (process.argv.includes('--help')) {
  console.log(`
Database Migration Script

Usage: node scripts/migrate.js [options]

Options:
  --force    Drop existing tables and recreate (CAUTION: This will delete all data)
  --alter    Alter existing tables to match current schema
  --help     Show this help message

Examples:
  node scripts/migrate.js                    # Create tables if they don't exist
  node scripts/migrate.js --alter            # Update existing tables
  node scripts/migrate.js --force            # Recreate all tables (destructive)
`);
  process.exit(0);
}

// Confirm destructive operations
if (process.argv.includes('--force')) {
  console.log('⚠️  WARNING: --force flag will DELETE ALL DATA in existing tables!');
  console.log('Are you sure you want to continue? (y/N)');
  
  process.stdin.on('data', (data) => {
    const input = data.toString().trim().toLowerCase();
    if (input === 'y' || input === 'yes') {
      runMigrations();
    } else {
      console.log('Migration cancelled.');
      process.exit(0);
    }
  });
} else {
  runMigrations();
}
