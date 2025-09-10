#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');

console.log(chalk.cyan('🎯 AyushBridge CLI Demonstration'));
console.log(chalk.gray('This script demonstrates the key features of the CLI\n'));

const demos = [
  {
    title: 'Health Check',
    description: 'Verify server connectivity and FHIR capabilities',
    command: 'node bin/ayush.js health'
  },
  {
    title: 'List Code Systems',
    description: 'Show available terminology systems',
    command: 'node bin/ayush.js terminology systems'
  },
  {
    title: 'List CodeSystems (FHIR Resources)',
    description: 'Show FHIR CodeSystem resources',
    command: 'node bin/ayush.js codesystem list --limit 3'
  },
  {
    title: 'NAMASTE to ICD-11 Translation',
    description: 'Translate a NAMASTE code to ICD-11 TM2',
    command: 'node bin/ayush.js terminology namaste-to-icd11 SR11'
  },
  {
    title: 'ICD-11 Code Lookup',
    description: 'Get detailed information about an ICD-11 code',
    command: 'node bin/ayush.js terminology icd11-lookup TM26.0'
  },
  {
    title: 'Search All Resources',
    description: 'Search across all FHIR resources',
    command: 'node bin/ayush.js search --query "fever" --limit 5'
  },
  {
    title: 'List Patients',
    description: 'Show patient records',
    command: 'node bin/ayush.js patient list --limit 3'
  },
  {
    title: 'Show Configuration',
    description: 'Display current CLI configuration',
    command: 'node bin/ayush.js config show'
  }
];

async function runDemo() {
  for (let i = 0; i < demos.length; i++) {
    const demo = demos[i];
    
    console.log(chalk.yellow(`\n${'='.repeat(60)}`));
    console.log(chalk.cyan(`${i + 1}. ${demo.title}`));
    console.log(chalk.gray(`${demo.description}`));
    console.log(chalk.blue(`Command: ${demo.command}`));
    console.log(chalk.yellow('='.repeat(60)));
    
    try {
      // Add a small delay for readability
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      execSync(demo.command, { 
        stdio: 'inherit',
        cwd: __dirname
      });
      
    } catch (error) {
      console.log(chalk.red(`❌ Demo failed: ${error.message}`));
      console.log(chalk.yellow('This might be expected if the server is not running or has no data'));
    }
    
    if (i < demos.length - 1) {
      console.log(chalk.gray('\nPress Ctrl+C to stop or wait for next demo...'));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(chalk.green('\n🎉 Demo completed!'));
  console.log('\nNext steps:');
  console.log('• Run ' + chalk.cyan('node bin/ayush.js --help') + ' to see all commands');
  console.log('• Create example files with the setup script');
  console.log('• Explore the README.md for detailed usage instructions');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Demo interrupted by user'));
  process.exit(0);
});

runDemo().catch(error => {
  console.error(chalk.red('Demo failed:'), error.message);
  process.exit(1);
});
