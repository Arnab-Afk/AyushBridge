require('dotenv').config();
const logger = require('../src/utils/logger');
const { sequelize } = require('../src/models');
const { NAMASTECode, ICD11Code, ConceptMapping } = require('../src/models');

/**
 * Database Setup Script
 * 
 * This script sets up the database tables and ensures everything is ready
 * for importing NAMASTE codes and using the FHIR terminology server.
 */

async function setupDatabase() {
  try {
    logger.info('🚀 Starting Database Setup');
    logger.info('='.repeat(50));

    // Test database connection
    logger.info('📡 Testing database connection...');
    await sequelize.authenticate();
    logger.info('✅ Database connection successful');

    // Show current database info
    const dbConfig = sequelize.config;
    logger.info(`📊 Database: ${dbConfig.database}`);
    logger.info(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    logger.info(`👤 User: ${dbConfig.username}`);

    // Check for force flag
    const forceSync = process.argv.includes('--force');
    
    if (forceSync) {
      logger.warn('⚠️ FORCE FLAG DETECTED. This will drop all existing tables!');
      logger.warn('⏱️ You have 5 seconds to cancel (Ctrl+C)...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      logger.warn('💣 Dropping and recreating all tables...');
      await sequelize.sync({ force: true });
      logger.info('✅ All tables were dropped and recreated.');
    } else {
      // Create/update tables
      logger.info('\n🔧 Creating/updating database tables...');
      await sequelize.sync({ alter: true });
      logger.info('✅ All tables created/updated successfully');
    }

    // Check existing data
    logger.info('\n📊 Checking existing data...');
    
    const namasteCount = await NAMASTECode.count();
    const icd11Count = await ICD11Code.count();
    const mappingCount = await ConceptMapping.count();

    logger.info(`📋 NAMASTE Codes: ${namasteCount}`);
    logger.info(`📋 ICD-11 Codes: ${icd11Count}`);
    logger.info(`📋 Concept Mappings: ${mappingCount}`);

    // Test basic model functionality
    logger.info('\n🧪 Testing model functionality...');
    
    // Test creating a sample NAMASTE code
    const testCode = await NAMASTECode.findOrCreate({
      where: { code: 'TEST_001' },
      defaults: {
        display: 'Test Ayurvedic Concept',
        traditional_system: 'ayurveda',
        definition: 'This is a test entry for database validation',
        status: 'active',
        properties: { source: 'database_setup' }
      }
    });

    if (testCode[1]) {
      logger.info('✅ Created test NAMASTE code');
      // Clean up test data
      await NAMASTECode.destroy({ where: { code: 'TEST_001' } });
      logger.info('🧹 Cleaned up test data');
    } else {
      logger.info('ℹ️  Test code already exists (database working)');
    }

    logger.info('\n🎉 Database setup completed successfully!');
    logger.info('\n📝 Next Steps:');
    logger.info('1. Prepare your CSV file with NAMASTE codes');
    logger.info('2. Run: npm run import:csv -- path/to/your/file.csv');
    logger.info('3. Start the server: npm run dev');

  } catch (error) {
    logger.error('💥 Database setup failed:', error);
    logger.error('\n🔍 Troubleshooting:');
    logger.error('1. Check your .env file has correct database credentials');
    logger.error('2. Ensure your database is accessible');
    logger.error('3. Verify network connectivity');
    throw error;
  } finally {
    await sequelize.close();
    logger.info('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      logger.info('✨ Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
