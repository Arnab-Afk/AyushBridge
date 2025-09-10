const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class ValidateCommand {
  static async validate(options) {
    const api = new ApiClient();
    
    try {
      // First, find the appropriate CodeSystem for the given system URI
      const codeSystemsResult = await api.withSpinner(
        api.getCodeSystems({ url: options.system }),
        'Finding CodeSystem...'
      );
      
      if (!codeSystemsResult.data.entry || codeSystemsResult.data.entry.length === 0) {
        console.error(Formatter.formatError(`No CodeSystem found for URI: ${options.system}`));
        
        // Show available systems
        console.log('\n' + chalk.yellow('Available code systems:'));
        const allSystemsResult = await api.getCodeSystems({ _count: 10 });
        if (allSystemsResult.data.entry) {
          allSystemsResult.data.entry.forEach(entry => {
            console.log(`  • ${entry.resource.url} (${entry.resource.name})`);
          });
        }
        
        process.exit(1);
      }
      
      const codeSystem = codeSystemsResult.data.entry[0].resource;
      
      const result = await api.withSpinner(
        api.validateCode(codeSystem.id, options.code, options.system),
        `Validating code ${options.code} in system ${options.system}...`
      );
      
      const isValid = result.data.parameter?.find(p => p.name === 'result')?.valueBoolean;
      
      console.log(Formatter.formatHeader('Code Validation Result'));
      console.log(`${chalk.blue('Code')}: ${options.code}`);
      console.log(`${chalk.blue('System')}: ${options.system}`);
      console.log(`${chalk.blue('CodeSystem')}: ${codeSystem.name} (${codeSystem.id})`);
      
      if (isValid) {
        console.log(`${chalk.blue('Result')}: ${chalk.green('✓ Valid')}`);
      } else {
        console.log(`${chalk.blue('Result')}: ${chalk.red('✗ Invalid')}`);
      }
      
      // Show additional details if available
      const messageParam = result.data.parameter?.find(p => p.name === 'message');
      if (messageParam) {
        console.log(`${chalk.blue('Message')}: ${messageParam.valueString}`);
      }
      
      const displayParam = result.data.parameter?.find(p => p.name === 'display');
      if (displayParam) {
        console.log(`${chalk.blue('Display')}: ${displayParam.valueString}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to validate code: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = ValidateCommand;
