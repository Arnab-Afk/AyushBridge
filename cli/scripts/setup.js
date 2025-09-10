#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

async function setupCli() {
  console.log(chalk.cyan('🚀 Setting up AyushBridge CLI...'));
  
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      console.error(chalk.red('❌ Node.js 16.0.0 or higher is required'));
      console.log(chalk.yellow(`Current version: ${nodeVersion}`));
      process.exit(1);
    }
    
    console.log(chalk.green(`✅ Node.js version check passed (${nodeVersion})`));
    
    // Install dependencies
    console.log(chalk.blue('📦 Installing dependencies...'));
    execSync('npm install', { stdio: 'inherit' });
    
    // Create example directory
    const exampleDir = path.join(__dirname, '..', 'examples');
    await fs.ensureDir(exampleDir);
    
    // Generate example files
    console.log(chalk.blue('📝 Creating example files...'));
    const FileUtils = require('../utils/file');
    await FileUtils.createExampleFiles(exampleDir);
    
    // Copy environment template
    const envExample = path.join(__dirname, '..', '.env.example');
    const envFile = path.join(__dirname, '..', '.env');
    
    if (!(await fs.pathExists(envFile))) {
      await fs.copy(envExample, envFile);
      console.log(chalk.green('✅ Environment file created (.env)'));
    }
    
    // Initialize CLI configuration
    console.log(chalk.blue('⚙️ Initializing CLI configuration...'));
    const Config = require('../utils/config');
    const config = new Config();
    await config.init();
    
    // Test basic functionality (if server is available)
    console.log(chalk.blue('🔌 Testing server connection...'));
    try {
      const ApiClient = require('../utils/api');
      const api = new ApiClient();
      await api.healthCheck();
      console.log(chalk.green('✅ Server connection successful'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Server not available (this is OK for initial setup)'));
      console.log(chalk.gray('   Make sure the FHIR backend is running when you use the CLI'));
    }
    
    console.log(chalk.green('\n🎉 AyushBridge CLI setup complete!'));
    console.log('\nNext steps:');
    console.log('1. Start the FHIR backend server');
    console.log('2. Run: ' + chalk.cyan('ayush health') + ' to test connectivity');
    console.log('3. Run: ' + chalk.cyan('ayush --help') + ' to see available commands');
    console.log('4. Check the README.md for detailed usage instructions');
    
  } catch (error) {
    console.error(chalk.red('❌ Setup failed:'), error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupCli();
}

module.exports = setupCli;
