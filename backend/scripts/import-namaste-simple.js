require('dotenv').config();
const XLSX = require('xlsx');
const path = require('path');
const { Sequelize } = require('sequelize');

/**
 * Simplified Excel Import Script for NAMASTE Codes
 * Works directly with SQL to avoid model loading issues
 */

class SimpleNAMASTEImporter {
  constructor(filePath) {
    this.filePath = filePath;
    this.successCount = 0;
    this.errorCount = 0;
    this.errors = [];
    
    // Create database connection
    const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
    
    this.sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  }

  async validateFile() {
    if (!this.filePath) {
      throw new Error('Excel file path is required');
    }

    const absolutePath = path.resolve(this.filePath);
    console.log(`📂 Checking file: ${absolutePath}`);

    try {
      const workbook = XLSX.readFile(absolutePath);
      const sheetNames = workbook.SheetNames;
      
      if (sheetNames.length === 0) {
        throw new Error('No sheets found in Excel file');
      }

      console.log(`✅ Found ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}`);
      return workbook;
    } catch (error) {
      throw new Error(`Failed to read Excel file: ${error.message}`);
    }
  }

  parseExcelData(workbook, sheetName = null) {
    const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { 
      header: 1,
      defval: '' 
    });

    console.log(`📊 Found ${jsonData.length} rows in sheet`);

    // Skip header row and filter empty rows
    const dataRows = jsonData.slice(1).filter(row => 
      row.some(cell => cell && cell.toString().trim())
    );

    console.log(`📊 Processing ${dataRows.length} data rows`);

    return dataRows.map((row, index) => {
      return this.mapRowToNAMASTECode(row, index + 2);
    }).filter(Boolean);
  }

  mapRowToNAMASTECode(row, rowNumber) {
    try {
      const [
        code,
        systemName,
        englishName,
        localName,
        description,
        category,
        indication,
        ...extraFields
      ] = row;

      // Validate required fields
      if (!code || !englishName) {
        this.errors.push(`Row ${rowNumber}: Missing required fields (code or englishName)`);
        return null;
      }

      const traditionalSystem = this.mapTraditionalSystem(systemName);

      return {
        code: code.toString().trim(),
        english_name: englishName.toString().trim(),
        local_name: localName ? localName.toString().trim() : null,
        description: description ? description.toString().trim() : null,
        traditional_system: traditionalSystem,
        category: category ? category.toString().trim() : null,
        indication: indication ? indication.toString().trim() : null,
        source: 'excel_import',
        status: 'active',
        version: '1.0'
      };
    } catch (error) {
      this.errors.push(`Row ${rowNumber}: ${error.message}`);
      return null;
    }
  }

  mapTraditionalSystem(systemName) {
    if (!systemName) return 'other';
    
    const system = systemName.toString().toLowerCase().trim();
    
    const systemMap = {
      'ayurveda': 'ayurveda',
      'ayurved': 'ayurveda',
      'yoga': 'yoga',
      'unani': 'unani',
      'siddha': 'siddha',
      'homeopathy': 'homeopathy',
      'homoeopathy': 'homeopathy',
      'naturopathy': 'naturopathy',
      'sowa-rigpa': 'sowa_rigpa',
      'sowa rigpa': 'sowa_rigpa',
      'folk medicine': 'folk_medicine',
      'folk': 'folk_medicine'
    };

    return systemMap[system] || 'other';
  }

  async checkDuplicates(codes) {
    console.log('🔍 Checking for existing codes...');
    
    const codesToCheck = codes.map(c => `'${c.code}'`).join(',');
    const [results] = await this.sequelize.query(`
      SELECT code FROM namaste_codes WHERE code IN (${codesToCheck})
    `);

    const existingCodeSet = new Set(results.map(r => r.code));
    const newCodes = codes.filter(c => !existingCodeSet.has(c.code));
    
    console.log(`📊 Found ${existingCodeSet.size} existing codes, ${newCodes.length} new codes`);
    
    return newCodes;
  }

  async importBatch(codes, batchSize = 100) {
    console.log(`🔄 Importing ${codes.length} codes in batches of ${batchSize}`);
    
    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      
      try {
        // Build INSERT query
        const values = batch.map(code => {
          const values = [
            `'${code.code.replace(/'/g, "''")}'`,
            `'${code.english_name.replace(/'/g, "''")}'`,
            code.local_name ? `'${code.local_name.replace(/'/g, "''")}'` : 'NULL',
            code.description ? `'${code.description.replace(/'/g, "''")}'` : 'NULL',
            `'${code.traditional_system}'`,
            code.category ? `'${code.category.replace(/'/g, "''")}'` : 'NULL',
            code.indication ? `'${code.indication.replace(/'/g, "''")}'` : 'NULL',
            `'${code.source}'`,
            `'${code.status}'`,
            `'${code.version}'`
          ];
          return `(${values.join(',')})`;
        }).join(',');

        const insertQuery = `
          INSERT INTO namaste_codes (
            code, english_name, local_name, description, traditional_system,
            category, indication, source, status, version
          ) VALUES ${values}
          ON CONFLICT (code) DO NOTHING
        `;

        await this.sequelize.query(insertQuery);
        
        this.successCount += batch.length;
        console.log(`✅ Imported batch ${Math.floor(i / batchSize) + 1}: ${batch.length} codes`);
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        this.errorCount += batch.length;
        this.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        console.error(`❌ Failed to import batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      }
    }
  }

  printSummary() {
    console.log('\n📋 IMPORT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully imported: ${this.successCount} codes`);
    console.log(`❌ Failed imports: ${this.errorCount} codes`);
    console.log(`⚠️  Total errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔍 ERRORS:');
      this.errors.slice(0, 10).forEach(error => {
        console.log(`  - ${error}`);
      });
      
      if (this.errors.length > 10) {
        console.log(`  ... and ${this.errors.length - 10} more errors`);
      }
    }
  }

  async run(options = {}) {
    const { 
      sheetName = null, 
      batchSize = 100, 
      skipDuplicateCheck = false 
    } = options;

    try {
      console.log('🚀 Starting NAMASTE Excel Import');
      console.log('='.repeat(50));

      // Connect to database
      await this.sequelize.authenticate();
      console.log('✅ Database connected successfully');

      // Validate and read Excel file
      const workbook = await this.validateFile();
      const codes = this.parseExcelData(workbook, sheetName);

      if (codes.length === 0) {
        throw new Error('No valid NAMASTE codes found in Excel file');
      }

      // Check for duplicates (optional)
      const codesToImport = skipDuplicateCheck ? codes : await this.checkDuplicates(codes);

      if (codesToImport.length === 0) {
        console.log('ℹ️  All codes already exist in database');
        return;
      }

      // Import in batches
      await this.importBatch(codesToImport, batchSize);

      // Print summary
      this.printSummary();

    } catch (error) {
      console.error('💥 Import failed:', error.message);
      throw error;
    } finally {
      await this.sequelize.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 NAMASTE Excel Import Tool (Simplified)

Usage:
  node scripts/import-namaste-simple.js <excel-file-path> [options]

Examples:
  node scripts/import-namaste-simple.js ./data/namaste-codes.xlsx
  node scripts/import-namaste-simple.js ./data/namaste-codes.xlsx --sheet="Sheet1"
  node scripts/import-namaste-simple.js ./data/namaste-codes.xlsx --batch-size=50

Options:
  --sheet=<name>        Specify sheet name (default: first sheet)
  --batch-size=<num>    Batch size for imports (default: 100)
  --skip-duplicates     Skip duplicate checking (faster but may cause errors)

Expected Excel Format:
  Column A: NAMASTE Code (required)
  Column B: System Name (Ayurveda, Yoga, etc.)
  Column C: English Name (required)
  Column D: Local/Sanskrit Name (optional)
  Column E: Description (optional)
  Column F: Category (optional)
  Column G: Indication/Usage (optional)
    `);
    process.exit(0);
  }

  const filePath = args[0];
  const options = {};

  // Parse command line options
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--sheet=')) {
      options.sheetName = arg.split('=')[1];
    } else if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1]);
    } else if (arg === '--skip-duplicates') {
      options.skipDuplicateCheck = true;
    }
  });

  const importer = new SimpleNAMASTEImporter(filePath);
  
  importer.run(options)
    .then(() => {
      console.log('🎉 Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error.message);
      process.exit(1);
    });
}

module.exports = SimpleNAMASTEImporter;
