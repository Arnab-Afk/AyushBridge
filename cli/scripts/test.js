#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');

async function testCli() {
  console.log(chalk.cyan('🧪 Testing AyushBridge CLI...'));
  
  const tests = [
    {
      name: 'Configuration Test',
      command: 'node bin/ayush.js config show',
      description: 'Test configuration loading'
    },
    {
      name: 'Help Test',
      command: 'node bin/ayush.js --help',
      description: 'Test help display'
    },
    {
      name: 'Health Check Test',
      command: 'node bin/ayush.js health',
      description: 'Test server connectivity',
      allowFailure: true
    },
    {
      name: 'CodeSystem List Test',
      command: 'node bin/ayush.js codesystem list --limit 1',
      description: 'Test CodeSystem listing',
      allowFailure: true
    },
    {
      name: 'Terminology Systems Test',
      command: 'node bin/ayush.js terminology systems',
      description: 'Test terminology systems listing',
      allowFailure: true
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(chalk.blue(`\nRunning: ${test.name}`));
      console.log(chalk.gray(`Description: ${test.description}`));
      console.log(chalk.gray(`Command: ${test.command}`));
      
      execSync(test.command, { 
        stdio: 'pipe',
        timeout: 10000
      });
      
      console.log(chalk.green(`✅ ${test.name} passed`));
      passed++;
      
    } catch (error) {
      if (test.allowFailure) {
        console.log(chalk.yellow(`⚠️  ${test.name} failed (expected if server not running)`));
        console.log(chalk.gray(`   Error: ${error.message.split('\n')[0]}`));
      } else {
        console.log(chalk.red(`❌ ${test.name} failed`));
        console.log(chalk.red(`   Error: ${error.message.split('\n')[0]}`));
        failed++;
      }
    }
  }
  
  console.log(chalk.cyan('\n📊 Test Summary:'));
  console.log(`${chalk.green(`✅ Passed: ${passed}`)}`);
  console.log(`${chalk.red(`❌ Failed: ${failed}`)}`);
  
  if (failed === 0) {
    console.log(chalk.green('\n🎉 All critical tests passed!'));
    console.log('The CLI is ready to use.');
  } else {
    console.log(chalk.red('\n💥 Some critical tests failed.'));
    console.log('Please check the setup and try again.');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  testCli();
}

module.exports = testCli;
