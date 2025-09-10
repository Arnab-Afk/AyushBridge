#!/usr/bin/env node

const { program } = require('commander');
const { version } = require('../package.json');
const chalk = require('chalk');

// Import command modules
const healthCommand = require('../commands/health');
const codeSystemCommands = require('../commands/codesystem');
const conceptMapCommands = require('../commands/conceptmap');
const valueSetCommands = require('../commands/valueset');
const conditionCommands = require('../commands/condition');
const patientCommands = require('../commands/patient');
const terminologyCommands = require('../commands/terminology');
const configCommands = require('../commands/config');
const validateCommands = require('../commands/validate');
const translateCommands = require('../commands/translate');
const searchCommands = require('../commands/search');

// ASCII Art Banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                    ${chalk.yellow.bold('AyushBridge CLI')}                    ${chalk.cyan('║')}
${chalk.cyan('║')}          ${chalk.green('FHIR R4 Compliant Healthcare Terminology')}         ${chalk.cyan('║')}
${chalk.cyan('║')}                ${chalk.blue('NAMASTE & ICD-11 TM2 Integration')}              ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

// Setup program
program
  .name('ayush')
  .description('AyushBridge CLI - FHIR Healthcare Terminology Management')
  .version(version)
  .option('-v, --verbose', 'Enable verbose output')
  .option('-c, --config <path>', 'Path to config file')
  .option('-s, --server <url>', 'FHIR server URL (default: http://localhost:3000)')
  .hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().verbose) {
      process.env.VERBOSE = 'true';
    }
    if (thisCommand.opts().server) {
      process.env.FHIR_SERVER = thisCommand.opts().server;
    }
  });

// Show banner on help
program.configureHelp({
  beforeAll: () => banner + '\n'
});

// Configuration Commands
program
  .command('config')
  .description('Manage CLI configuration')
  .addCommand(configCommands.init())
  .addCommand(configCommands.show())
  .addCommand(configCommands.set())
  .addCommand(configCommands.reset());

// Health Check Commands
program
  .command('health')
  .description('Check server health and connectivity')
  .action(healthCommand.check);

// CodeSystem Commands
const codeSystemCmd = program
  .command('codesystem')
  .alias('cs')
  .description('Manage FHIR CodeSystems');

codeSystemCmd
  .command('list')
  .description('List all CodeSystems')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(codeSystemCommands.list);

codeSystemCmd
  .command('get <id>')
  .description('Get CodeSystem by ID')
  .option('-f, --format <type>', 'Output format (table|json)', 'json')
  .action(codeSystemCommands.get);

codeSystemCmd
  .command('create <file>')
  .description('Create CodeSystem from JSON file')
  .action(codeSystemCommands.create);

codeSystemCmd
  .command('update <id> <file>')
  .description('Update CodeSystem with JSON file')
  .action(codeSystemCommands.update);

codeSystemCmd
  .command('delete <id>')
  .description('Delete CodeSystem')
  .option('-y, --yes', 'Skip confirmation')
  .action(codeSystemCommands.remove);

codeSystemCmd
  .command('lookup <id> <code>')
  .description('Lookup code in CodeSystem')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(codeSystemCommands.lookup);

codeSystemCmd
  .command('validate <id> <code>')
  .description('Validate code in CodeSystem')
  .action(codeSystemCommands.validate);

// ConceptMap Commands
const conceptMapCmd = program
  .command('conceptmap')
  .alias('cm')
  .description('Manage FHIR ConceptMaps');

conceptMapCmd
  .command('list')
  .description('List all ConceptMaps')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(conceptMapCommands.list);

conceptMapCmd
  .command('get <id>')
  .description('Get ConceptMap by ID')
  .option('-f, --format <type>', 'Output format (table|json)', 'json')
  .action(conceptMapCommands.get);

conceptMapCmd
  .command('create <file>')
  .description('Create ConceptMap from JSON file')
  .action(conceptMapCommands.create);

conceptMapCmd
  .command('translate <id> <code>')
  .description('Translate code using ConceptMap')
  .requiredOption('-s, --system <uri>', 'Source code system URI')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(conceptMapCommands.translate);

// ValueSet Commands
const valueSetCmd = program
  .command('valueset')
  .alias('vs')
  .description('Manage FHIR ValueSets');

valueSetCmd
  .command('list')
  .description('List all ValueSets')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(valueSetCommands.list);

valueSetCmd
  .command('get <id>')
  .description('Get ValueSet by ID')
  .option('-f, --format <type>', 'Output format (table|json)', 'json')
  .action(valueSetCommands.get);

valueSetCmd
  .command('expand <id>')
  .description('Expand ValueSet concepts')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(valueSetCommands.expand);

// Patient Commands
const patientCmd = program
  .command('patient')
  .alias('pt')
  .description('Manage FHIR Patients');

patientCmd
  .command('list')
  .description('List all Patients')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(patientCommands.list);

patientCmd
  .command('get <id>')
  .description('Get Patient by ID')
  .option('-f, --format <type>', 'Output format (table|json)', 'json')
  .action(patientCommands.get);

patientCmd
  .command('create <file>')
  .description('Create Patient from JSON file')
  .action(patientCommands.create);

// Condition Commands
const conditionCmd = program
  .command('condition')
  .alias('cond')
  .description('Manage FHIR Conditions');

conditionCmd
  .command('list')
  .description('List all Conditions')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(conditionCommands.list);

conditionCmd
  .command('get <id>')
  .description('Get Condition by ID')
  .option('-f, --format <type>', 'Output format (table|json)', 'json')
  .action(conditionCommands.get);

conditionCmd
  .command('create <file>')
  .description('Create Condition from JSON file')
  .action(conditionCommands.create);

// High-level Operations Commands
program
  .command('validate')
  .description('Validate codes across systems')
  .requiredOption('-c, --code <code>', 'Code to validate')
  .requiredOption('-s, --system <uri>', 'Code system URI')
  .action(validateCommands.validate);

program
  .command('translate')
  .description('Translate codes between systems')
  .requiredOption('-c, --code <code>', 'Code to translate')
  .requiredOption('-f, --from <uri>', 'Source system URI')
  .requiredOption('-t, --to <uri>', 'Target system URI')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(translateCommands.translate);

program
  .command('search')
  .description('Search across all resources')
  .requiredOption('-q, --query <term>', 'Search term')
  .option('-t, --type <resource>', 'Resource type filter')
  .option('-l, --limit <number>', 'Limit results', '20')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(searchCommands.search);

// Terminology Operations
const termCmd = program
  .command('terminology')
  .alias('term')
  .description('Advanced terminology operations');

termCmd
  .command('namaste-to-icd11 <code>')
  .description('Translate NAMASTE code to ICD-11 TM2')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(terminologyCommands.namasteToIcd11);

termCmd
  .command('icd11-lookup <code>')
  .description('Lookup ICD-11 TM2 code details')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(terminologyCommands.icd11Lookup);

termCmd
  .command('systems')
  .description('List available code systems')
  .option('-f, --format <type>', 'Output format (table|json)', 'table')
  .action(terminologyCommands.listSystems);

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err.code === 'commander.helpDisplayed') {
    process.exit(0);
  }
  if (err.code === 'commander.version') {
    process.exit(0);
  }
  
  console.error(chalk.red('Error:'), err.message);
  if (process.env.VERBOSE) {
    console.error(err);
  }
  process.exit(1);
}

// If no command provided, show help
if (!process.argv.slice(2).length) {
  console.log(banner);
  program.outputHelp();
}
