require('dotenv').config();

console.log('🔧 Loading environment variables...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);

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
    console.log('🚀 Starting Database Setup');
    console.log('='.repeat(50));

    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Show current database info
    const dbConfig = sequelize.config;
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`👤 User: ${dbConfig.username}`);

    // Create/update tables
    console.log('\n🔧 Creating/updating database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ All tables created/updated successfully');

    // Check existing data
    console.log('\n📊 Checking existing data...');
    
    const namasteCount = await NAMASTECode.count();
    const icd11Count = await ICD11Code.count();
    const mappingCount = await ConceptMapping.count();

    console.log(`📋 NAMASTE Codes: ${namasteCount}`);
    console.log(`📋 ICD-11 Codes: ${icd11Count}`);
    console.log(`📋 Concept Mappings: ${mappingCount}`);

    // Test basic model functionality
    console.log('\n🧪 Testing model functionality...');
    
    // Test creating a sample NAMASTE code
    const testCode = await NAMASTECode.findOrCreate({
      where: { code: 'TEST_001' },
      defaults: {
        english_name: 'Test Ayurvedic Concept',
        traditional_system: 'ayurveda',
        description: 'This is a test entry for database validation',
        source: 'database_setup',
        status: 'active'
      }
    });

    if (testCode[1]) {
      console.log('✅ Created test NAMASTE code');
      // Clean up test data
      await NAMASTECode.destroy({ where: { code: 'TEST_001' } });
      console.log('🧹 Cleaned up test data');
    } else {
      console.log('ℹ️  Test code already exists (database working)');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Prepare your Excel file with NAMASTE codes');
    console.log('2. Run: node scripts/import-namaste.js <your-excel-file>');
    console.log('3. Start the server: npm run dev');

  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Check your .env file has correct database credentials');
    console.error('2. Ensure your Neon database is accessible');
    console.error('3. Verify network connectivity');
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✨ Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
