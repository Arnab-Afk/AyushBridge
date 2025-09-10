const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const FileUtils = require('../utils/file');
const chalk = require('chalk');
const inquirer = require('inquirer');

class CodeSystemCommand {
  static async list(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 10;
      const params = { _count: limit };
      
      const result = await api.withSpinner(
        api.getCodeSystems(params),
        'Fetching CodeSystems...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No CodeSystems found'));
        return;
      }
      
      const codeSystems = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(codeSystems));
      } else {
        console.log(Formatter.formatHeader(`CodeSystems (${codeSystems.length})`));
        console.log(Formatter.formatCodeSystemTable(codeSystems));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list CodeSystems: ${error.message}`));
      process.exit(1);
    }
  }

  static async get(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getCodeSystem(id),
        `Fetching CodeSystem ${id}...`
      );
      
      if (options.format === 'table') {
        console.log(Formatter.formatHeader('CodeSystem Details'));
        
        const codeSystem = result.data;
        const details = [
          ['ID', codeSystem.id],
          ['Name', codeSystem.name],
          ['Title', codeSystem.title],
          ['URL', codeSystem.url],
          ['Version', codeSystem.version],
          ['Status', codeSystem.status],
          ['Publisher', codeSystem.publisher],
          ['Description', codeSystem.description],
          ['Content', codeSystem.content],
          ['Count', codeSystem.count]
        ];
        
        console.log(Formatter.formatTable(details.map(([key, value]) => ({ Property: key, Value: value || 'N/A' }))));
        
        if (codeSystem.concept && codeSystem.concept.length > 0) {
          console.log('\n' + chalk.cyan('Concepts:'));
          console.log(Formatter.formatTable(codeSystem.concept, [
            { header: 'CODE', key: 'code', width: 20 },
            { header: 'DISPLAY', key: 'display', width: 30 },
            { header: 'DEFINITION', key: 'definition', width: 50 }
          ]));
        }
      } else {
        console.log(Formatter.formatJson(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to get CodeSystem: ${error.message}`));
      process.exit(1);
    }
  }

  static async create(filePath) {
    const api = new ApiClient();
    
    try {
      const data = await FileUtils.readJsonFile(filePath);
      await FileUtils.validateFhirResource(data, 'CodeSystem');
      
      const result = await api.withSpinner(
        api.createCodeSystem(data),
        'Creating CodeSystem...'
      );
      
      console.log(Formatter.formatSuccess(`CodeSystem created successfully`));
      console.log(`${chalk.blue('ID')}: ${result.data.id}`);
      console.log(`${chalk.blue('URL')}: ${result.data.url}`);
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to create CodeSystem: ${error.message}`));
      process.exit(1);
    }
  }

  static async update(id, filePath) {
    const api = new ApiClient();
    
    try {
      const data = await FileUtils.readJsonFile(filePath);
      await FileUtils.validateFhirResource(data, 'CodeSystem');
      
      // Ensure the ID matches
      if (data.id && data.id !== id) {
        console.warn(chalk.yellow(`Warning: File ID (${data.id}) doesn't match provided ID (${id}). Using provided ID.`));
      }
      data.id = id;
      
      const result = await api.withSpinner(
        api.updateCodeSystem(id, data),
        `Updating CodeSystem ${id}...`
      );
      
      console.log(Formatter.formatSuccess(`CodeSystem updated successfully`));
      console.log(`${chalk.blue('ID')}: ${result.data.id}`);
      console.log(`${chalk.blue('URL')}: ${result.data.url}`);
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to update CodeSystem: ${error.message}`));
      process.exit(1);
    }
  }

  static async remove(id, options) {
    const api = new ApiClient();
    
    try {
      if (!options.yes) {
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `Are you sure you want to delete CodeSystem '${id}'?`,
            default: false
          }
        ]);
        
        if (!answers.confirmed) {
          console.log(chalk.yellow('Operation cancelled'));
          return;
        }
      }
      
      await api.withSpinner(
        api.deleteCodeSystem(id),
        `Deleting CodeSystem ${id}...`
      );
      
      console.log(Formatter.formatSuccess(`CodeSystem ${id} deleted successfully`));
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to delete CodeSystem: ${error.message}`));
      process.exit(1);
    }
  }

  static async lookup(codeSystemId, code, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.lookupCode(codeSystemId, code),
        `Looking up code ${code} in CodeSystem ${codeSystemId}...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader(`Code Lookup: ${code}`));
        console.log(Formatter.formatLookupResult(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to lookup code: ${error.message}`));
      process.exit(1);
    }
  }

  static async validate(codeSystemId, code) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.validateCode(codeSystemId, code),
        `Validating code ${code} in CodeSystem ${codeSystemId}...`
      );
      
      const isValid = result.data.parameter?.find(p => p.name === 'result')?.valueBoolean;
      
      if (isValid) {
        console.log(Formatter.formatSuccess(`Code '${code}' is valid`));
      } else {
        console.log(Formatter.formatError(`Code '${code}' is not valid`));
      }
      
      // Show additional details if available
      const messageParam = result.data.parameter?.find(p => p.name === 'message');
      if (messageParam) {
        console.log(`${chalk.blue('Message')}: ${messageParam.valueString}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to validate code: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = CodeSystemCommand;
